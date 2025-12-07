import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getAuthenticatedUser } from './users';

export const toggleBookmark = mutation({
  args: { postId: v.id('posts') },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const existing = await ctx.db
      .query('bookmarks')
      .withIndex('by_user_and_post', (q) =>
        q.eq('userId', currentUser._id).eq('postId', args.postId),
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return false;
    } else {
      await ctx.db.insert('bookmarks', {
        userId: currentUser._id,
        postId: args.postId,
      });
      return true;
    }
  },
});

// Экспорт query-функции для получения списка закладок
export const getBookmarkedPosts = query({
  // Обработчик запроса, принимающий контекст (ctx)
  handler: async (ctx) => {
    // Получаем текущего аутентифицированного пользователя
    const currentUser = await getAuthenticatedUser(ctx);

    // Выполняем запрос к таблице 'bookmarks'
    const bookmarks = await ctx.db
      .query('bookmarks')
      // Используем индекс 'by_user' для поиска закладок конкрентого пользователя
      .withIndex('by_user', (q) => q.eq('userId', currentUser._id))
      // Сортируем результаты в обратном порядке (от новых к старым)
      .order('desc')
      // Собираем результаты запроса в массив
      .collect();

    // Если закладок нет, возвращаем пустой массив и ID пользователя
    if (bookmarks.length === 0) {
      return { posts: [], currentUserId: currentUser._id };
    }

    // Обогащаем каждую закладку детальной информацией о посте и пользователе
    const bookmarksWithInfo = await Promise.all(
      bookmarks.map(async (bookmark) => {
        // Получаем данные поста по ID из закладки
        const post = await ctx.db.get(bookmark.postId);
        // Если пост не найден (например, удален), возвращаем null
        if (!post) return null;

        // Получаем данные автора поста
        const user = await ctx.db.get(post.userId);

        // Проверяем, лайкнул ли пост текущий пользователь
        const likes = await ctx.db
          .query('likes')
          // Используем индекс для поиска лайка по ID пользователя и ID поста
          .withIndex('by_user_and_post', (q) =>
            q.eq('userId', currentUser._id).eq('postId', post._id),
          )
          // Берем первый найденный результат (или null)
          .first();

        // Так как мы берем пост из списка закладок, он гарантированно в закладках
        const isBookmarked = true;

        // Возвращаем объект поста с дополнительными полями
        return {
          ...post, // Копируем все поля поста
          // Формируем объект пользователя (автора поста)
          user: user?.deletedAt
            ? {
                // Если пользователь удален, возвращаем заглушку
                _id: user._id,
                name: '[Deleted User]',
                fullName: '[Deleted User]',
                image: undefined,
              }
            : user
              ? {
                  // Если пользователь существует, возвращаем его данные
                  _id: user._id,
                  name: user.name,
                  fullName: user.fullName,
                  image: user.image,
                }
              : null, // Если пользователь не найден
          // Преобразуем наличие лайка в булево значение
          isLiked: !!likes,
          // Флаг того, что пост в закладках
          isBookmarked,
        };
      }),
    );

    // Удаляем из списка посты, которые были null (удаленные посты)
    const validPosts = bookmarksWithInfo.filter((p) => p !== null);

    // Возвращаем итоговый список постов и ID текущего пользователя
    return { posts: validPosts, currentUserId: currentUser._id };
  },
});
