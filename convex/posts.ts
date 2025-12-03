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

export const getPosts = query({
  args: {},
  handler: async (ctx) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const posts = await ctx.db.query('posts').order('desc').collect();

    if (posts.length === 0) {
      return [];
    }

    return await Promise.all(
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
  },
});
