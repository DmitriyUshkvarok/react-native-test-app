import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getAuthenticatedUser } from './users';

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new Error('Unauthorized');
  }

  return await ctx.storage.generateUploadUrl();
});

export const createPost = mutation({
  args: {
    caption: v.optional(v.string()),
    storageId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);
    if (!currentUser) {
      throw new Error('User not found');
    }

    const imageUrl = await ctx.storage.getUrl(args.storageId);

    if (!imageUrl) {
      throw new Error('Image URL not found');
    }

    const postId = await ctx.db.insert('posts', {
      userId: currentUser._id,
      imageUrl,
      storageId: args.storageId,
      caption: args.caption,
      likes: 0,
      comments: 0,
    });

    await ctx.db.patch(currentUser._id, {
      posts: currentUser.posts + 1,
    });

    return postId;
  },
});

export const deletePost = mutation({
  args: {
    postId: v.id('posts'),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error('Post not found');
    }

    // Проверка владельца поста
    if (post.userId !== currentUser._id) {
      throw new Error('Unauthorized: You can only delete your own posts');
    }

    // 1. Удаляем все лайки, связанные с постом
    const likes = await ctx.db
      .query('likes')
      .withIndex('by_post', (q) => q.eq('postId', args.postId))
      .collect();

    for (const like of likes) {
      await ctx.db.delete(like._id);
    }

    // 2. Удаляем все комментарии, связанные с постом
    const comments = await ctx.db
      .query('comments')
      .withIndex('by_post', (q) => q.eq('postId', args.postId))
      .collect();

    for (const comment of comments) {
      await ctx.db.delete(comment._id);
    }

    // 3. Удаляем все закладки, связанные с постом
    const bookmarks = await ctx.db
      .query('bookmarks')
      .withIndex('by_post', (q) => q.eq('postId', args.postId))
      .collect();

    for (const bookmark of bookmarks) {
      await ctx.db.delete(bookmark._id);
    }

    // 4. Удаляем сам пост
    await ctx.db.delete(args.postId);

    // 5. Опционально: удаляем файл из хранилища
    if (post.storageId) {
      await ctx.storage.delete(post.storageId);
    }

    // 6. Обновляем счетчики пользователя (посты и лайки)
    await ctx.db.patch(currentUser._id, {
      posts: Math.max(0, currentUser.posts - 1),
      likes: Math.max(0, currentUser.likes - likes.length), // Вычитаем количество лайков, которые были у удаленного поста
    });

    return { success: true };
  },
});

export const updatePost = mutation({
  args: {
    postId: v.id('posts'),
    caption: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error('Post not found');
    }

    // Проверка владельца поста
    if (post.userId !== currentUser._id) {
      throw new Error('Unauthorized: You can only edit your own posts');
    }

    // Обновляем подпись
    await ctx.db.patch(args.postId, {
      caption: args.caption,
    });

    return { success: true };
  },
});

export const toggleLike = mutation({
  args: {
    postId: v.id('posts'),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error('Post not found');
    }

    // Проверка, если пользователь уже лайкал пост
    const existingLike = await ctx.db
      .query('likes')
      .withIndex('by_user_and_post', (q) =>
        q.eq('userId', currentUser._id).eq('postId', args.postId),
      )
      .first();

    if (existingLike) {
      // Отмена лайка
      await ctx.db.delete(existingLike._id);

      // Уменьшаем количество лайков у поста
      await ctx.db.patch(args.postId, {
        likes: Math.max(0, post.likes - 1),
      });

      // Уменьшаем количество лайков у автора поста
      const author = await ctx.db.get(post.userId);
      if (author) {
        await ctx.db.patch(author._id, {
          likes: Math.max(0, author.likes - 1),
        });
      }

      return false; // Не лайкал больше
    } else {
      // Лайк
      await ctx.db.insert('likes', {
        userId: currentUser._id,
        postId: args.postId,
      });

      // Увеличиваем количество лайков у поста
      await ctx.db.patch(args.postId, {
        likes: post.likes + 1,
      });

      // Увеличиваем количество лайков у автора поста
      const author = await ctx.db.get(post.userId);
      if (author) {
        await ctx.db.patch(author._id, {
          likes: author.likes + 1,
        });
      }

      // Отправка уведомления автору поста
      if (post.userId !== currentUser._id) {
        // Проверка, если уведомление уже существует, чтобы избежать спама
        const existingNotification = await ctx.db
          .query('notifications')
          .withIndex('by_receiver', (q) => q.eq('receiverId', post.userId))
          .filter((q) =>
            q.and(
              q.eq(q.field('type'), 'like'),
              q.eq(q.field('postId'), args.postId),
              q.eq(q.field('senderId'), currentUser._id),
            ),
          )
          .first();

        if (!existingNotification) {
          await ctx.db.insert('notifications', {
            receiverId: post.userId,
            senderId: currentUser._id,
            type: 'like',
            postId: args.postId,
            read: false,
          });
        }
      }

      return true; // Liked
    }
  },
});

export const getPosts = query({
  args: {},
  handler: async (ctx) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const posts = await ctx.db.query('posts').order('desc').collect();

    if (posts.length === 0) {
      return { posts: [], currentUserId: currentUser?._id };
    }

    const postsWithDetails = await Promise.all(
      posts.map(async (post) => {
        const user = await ctx.db.get(post.userId);

        const likes = currentUser
          ? await ctx.db
              .query('likes')
              .withIndex('by_user_and_post', (q) =>
                q.eq('userId', currentUser._id).eq('postId', post._id),
              )
              .first()
          : null;

        const bookmarked = currentUser
          ? await ctx.db
              .query('bookmarks')
              .withIndex('by_user_and_post', (q) =>
                q.eq('userId', currentUser._id).eq('postId', post._id),
              )
              .first()
          : null;

        return {
          ...post,
          user: user?.deletedAt
            ? {
                _id: user._id,
                name: '[Deleted User]',
                fullName: '[Deleted User]',
                image: undefined,
              }
            : user
              ? {
                  _id: user._id,
                  name: user.name,
                  fullName: user.fullName,
                  image: user.image,
                }
              : null,
          isLiked: !!likes,
          isBookmarked: !!bookmarked,
        };
      }),
    );

    return { posts: postsWithDetails, currentUserId: currentUser?._id };
  },
});

// Получить один пост по ID (для детального просмотра)
export const getPostById = query({
  args: {
    postId: v.id('posts'),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const post = await ctx.db.get(args.postId);

    if (!post) {
      return null;
    }

    const user = await ctx.db.get(post.userId);

    const likes = currentUser
      ? await ctx.db
          .query('likes')
          .withIndex('by_user_and_post', (q) =>
            q.eq('userId', currentUser._id).eq('postId', post._id),
          )
          .first()
      : null;

    const bookmarked = currentUser
      ? await ctx.db
          .query('bookmarks')
          .withIndex('by_user_and_post', (q) =>
            q.eq('userId', currentUser._id).eq('postId', post._id),
          )
          .first()
      : null;

    const postWithDetails = {
      ...post,
      user: user?.deletedAt
        ? {
            _id: user._id,
            name: '[Deleted User]',
            fullName: '[Deleted User]',
            image: undefined,
          }
        : user
          ? {
              _id: user._id,
              name: user.name,
              fullName: user.fullName,
              image: user.image,
            }
          : null,
      isLiked: !!likes,
      isBookmarked: !!bookmarked,
    };

    return { post: postWithDetails, currentUserId: currentUser?._id };
  },
});

// Получить посты автора (для футера на странице деталей поста)
export const getPostsByAuthor = query({
  args: {
    userId: v.id('users'),
    excludePostId: v.optional(v.id('posts')),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);
    const limit = args.limit ?? 5;

    // Получаем все посты автора
    const allPosts = await ctx.db
      .query('posts')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .order('desc')
      .collect();

    // Фильтруем, исключая текущий пост
    const filteredPosts = args.excludePostId
      ? allPosts.filter((post) => post._id !== args.excludePostId)
      : allPosts;

    // Ограничиваем количество
    const posts = filteredPosts.slice(0, limit);

    if (posts.length === 0) {
      return [];
    }

    // Добавляем детали к каждому посту
    const postsWithDetails = await Promise.all(
      posts.map(async (post) => {
        const user = await ctx.db.get(post.userId);

        const likes = currentUser
          ? await ctx.db
              .query('likes')
              .withIndex('by_user_and_post', (q) =>
                q.eq('userId', currentUser._id).eq('postId', post._id),
              )
              .first()
          : null;

        const bookmarked = currentUser
          ? await ctx.db
              .query('bookmarks')
              .withIndex('by_user_and_post', (q) =>
                q.eq('userId', currentUser._id).eq('postId', post._id),
              )
              .first()
          : null;

        return {
          ...post,
          user: user?.deletedAt
            ? {
                _id: user._id,
                name: '[Deleted User]',
                fullName: '[Deleted User]',
                image: undefined,
              }
            : user
              ? {
                  _id: user._id,
                  name: user.name,
                  fullName: user.fullName,
                  image: user.image,
                }
              : null,
          isLiked: !!likes,
          isBookmarked: !!bookmarked,
        };
      }),
    );

    return postsWithDetails;
  },
});
