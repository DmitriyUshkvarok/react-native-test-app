import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getAuthenticatedUser } from './users';

// Получение комментариев для поста
export const getComments = query({
  args: {
    postId: v.id('posts'),
  },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query('comments')
      .withIndex('by_post', (q) => q.eq('postId', args.postId))
      .order('desc') // Сначала новые
      .collect();

    const commentsWithDetails = await Promise.all(
      comments.map(async (comment) => {
        const user = await ctx.db.get(comment.userId);
        return {
          ...comment,
          user: user
            ? {
                _id: user._id,
                name: user.name,
                fullName: user.fullName,
                image: user.image,
              }
            : null,
        };
      }),
    );

    return commentsWithDetails;
  },
});

// Создание нового комментария
export const createComment = mutation({
  args: {
    postId: v.id('posts'),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);
    if (!currentUser) {
      throw new Error('Unauthorized');
    }

    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error('Post not found');
    }

    const commentId = await ctx.db.insert('comments', {
      userId: currentUser._id,
      postId: args.postId,
      content: args.content,
    });

    // Увеличиваем счетчик комментариев у поста
    await ctx.db.patch(args.postId, {
      comments: post.comments + 1,
    });

    // Отправка уведомления автору поста (если это не он сам)
    if (post.userId !== currentUser._id) {
      await ctx.db.insert('notifications', {
        receiverId: post.userId,
        senderId: currentUser._id,
        type: 'comment',
        postId: args.postId,
        commentId: commentId,
        read: false,
      });
    }

    return commentId;
  },
});

// Удаление комментария
export const deleteComment = mutation({
  args: {
    commentId: v.id('comments'),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);
    if (!currentUser) {
      throw new Error('Unauthorized');
    }

    const comment = await ctx.db.get(args.commentId);
    if (!comment) {
      throw new Error('Comment not found');
    }

    const post = await ctx.db.get(comment.postId);

    // Удалить может либо автор комментария, либо автор поста
    const isCommentAuthor = comment.userId === currentUser._id;
    const isPostAuthor = post && post.userId === currentUser._id;

    if (!isCommentAuthor && !isPostAuthor) {
      throw new Error('Unauthorized');
    }

    await ctx.db.delete(args.commentId);

    // Уменьшаем счетчик комментариев
    if (post) {
      await ctx.db.patch(post._id, {
        comments: Math.max(0, post.comments - 1),
      });
    }

    return { success: true };
  },
});
