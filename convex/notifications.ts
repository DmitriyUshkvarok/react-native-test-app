import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getAuthenticatedUser } from './users';

// Получить уведомления текущего пользователя
export const get = query({
  args: {},
  handler: async (ctx) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const notifications = await ctx.db
      .query('notifications')
      .withIndex('by_receiver', (q) => q.eq('receiverId', currentUser._id))
      .order('desc')
      .take(50);

    // Расширяем данные: добавляем информацию об отправителе, посте и комментарии
    const enrichedNotifications = await Promise.all(
      notifications.map(async (notification) => {
        const sender = await ctx.db.get(notification.senderId);
        const post = notification.postId
          ? await ctx.db.get(notification.postId)
          : null;
        const comment = notification.commentId
          ? await ctx.db.get(notification.commentId)
          : null;

        return {
          ...notification,
          sender,
          post,
          comment,
        };
      }),
    );

    return enrichedNotifications;
  },
});

// Получить количество непрочитанных уведомлений
export const getUnreadCount = query({
  args: {},
  handler: async (ctx) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const unreadNotifications = await ctx.db
      .query('notifications')
      .withIndex('by_receiver', (q) => q.eq('receiverId', currentUser._id))
      .filter((q) => q.eq(q.field('read'), false))
      .collect();

    return unreadNotifications.length;
  },
});

// Отметить уведомления как прочитанные
export const markAsRead = mutation({
  args: {
    notificationIds: v.array(v.id('notifications')),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    for (const notificationId of args.notificationIds) {
      const notification = await ctx.db.get(notificationId);

      // Проверяем, что уведомление принадлежит текущему пользователю
      if (notification && notification.receiverId === currentUser._id) {
        await ctx.db.patch(notificationId, { read: true });
      }
    }
  },
});

// Отметить все уведомления как прочитанные
export const markAllAsRead = mutation({
  args: {},
  handler: async (ctx) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const unreadNotifications = await ctx.db
      .query('notifications')
      .withIndex('by_receiver', (q) => q.eq('receiverId', currentUser._id))
      .filter((q) => q.eq(q.field('read'), false))
      .collect();

    for (const notification of unreadNotifications) {
      await ctx.db.patch(notification._id, { read: true });
    }
  },
});
