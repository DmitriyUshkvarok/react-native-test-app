import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Получить всех пользователей
export const getUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('users').order('desc').take(100);
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

// Удалить пользователя
export const deleteUser = mutation({
  args: {
    id: v.id('users'),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
