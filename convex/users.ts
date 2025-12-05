import { v } from 'convex/values';
import { mutation, MutationCtx, query, QueryCtx } from './_generated/server';

// Получить всех пользователей (исключая удаленных)
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    return await getAuthenticatedUser(ctx);
  },
});

export const getUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('deletedAt'), undefined))
      .order('desc')
      .take(100);
  },
});

// Получить пользователя по ID
export const getUserById = query({
  args: {
    id: v.id('users'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Создать нового пользователя
export const createUser = mutation({
  args: {
    name: v.string(),
    fullName: v.string(),
    image: v.optional(v.string()),
    bio: v.optional(v.string()),
    email: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = {
      name: args.name,
      fullName: args.fullName,
      image: args.image,
      bio: args.bio,
      email: args.email,
      clerkId: args.clerkId,
      followers: 0,
      following: 0,
      posts: 0,
      likes: 0,
      deletedAt: undefined,
    };

    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
      .first();

    if (existingUser) return;

    await ctx.db.insert('users', user);
  },
});

// Обновить пользователя
export const updateUser = mutation({
  args: {
    id: v.id('users'),
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      name: args.name,
      email: args.email,
    });
  },
});

// Мягкое удаление пользователя (Soft Delete)
export const deleteUser = mutation({
  args: {
    id: v.id('users'),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      deletedAt: Date.now(),
    });
  },
});

// Восстановить удаленного пользователя
export const restoreUser = mutation({
  args: {
    id: v.id('users'),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      deletedAt: undefined,
    });
  },
});

export async function getAuthenticatedUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error('Unauthorized');

  const currentUser = await ctx.db
    .query('users')
    .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
    .first();

  if (currentUser) {
    return currentUser;
  }

  // Если пользователя нет в базе, но он авторизован — создаем его (только в мутациях)
  // Проверяем, есть ли метод insert (признак MutationCtx)

  if ('insert' in ctx.db) {
    const newUserId = await ctx.db.insert('users', {
      fullName: identity.name || 'User',
      email: identity.email || '',
      clerkId: identity.subject,
      image: identity.pictureUrl,
      name: identity.email?.split('@')[0] || 'User',
      bio: '',
      followers: 0,
      following: 0,
      posts: 0,
      likes: 0,
      deletedAt: undefined,
    });

    const newUser = await ctx.db.get(newUserId);
    if (!newUser) throw new Error('Failed to create user');
    return newUser;
  }

  throw new Error('User not found');
}
