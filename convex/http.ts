import { httpRouter } from 'convex/server';
import { Webhook } from 'svix';
import { api } from './_generated/api';
import { httpAction } from './_generated/server';

const http = httpRouter();

http.route({
  path: '/clerk-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, req) => {
    // 1. Создаем экземпляр Webhook с нашим секретным ключом из переменных окружения
    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

    // 2. Проверяем, что секретный ключ существует (иначе выбрасываем ошибку)
    if (!webhook) {
      throw new Error('Webhook not found');
    }

    // 3. Получаем заголовки Svix из запроса (нужны для проверки подписи)
    const svix_id = req.headers.get('svix-id'); // Уникальный ID сообщения
    const svix_timestamp = req.headers.get('svix-timestamp'); // Временная метка
    const svix_signature = req.headers.get('svix-signature'); // Сама подпись

    // 4. Если хотя бы одного заголовка нет — это невалидный запрос
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response('Invalid headers', { status: 400 });
    }

    // 5. Читаем тело запроса как текст (ВАЖНО: именно как текст для проверки подписи)
    const body = await req.text();

    // 6. Переменная для хранения проверенного события
    let event: any;

    try {
      // 7. Проверяем подпись: сверяем тело запроса и заголовки с нашим секретом
      event = webhook.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      });
    } catch (error) {
      // 8. Если подпись не совпала — возвращаем ошибку 400
      return new Response('Invalid signature', { status: 400 });
    }

    // 9. Получаем тип события (например, 'user.created')
    const eventType = event.type;

    // 10. Если это событие создания пользователя
    if (eventType === 'user.created') {
      // 11. Извлекаем данные пользователя из события
      const { id, email_addresses, first_name, last_name, image_url } =
        event.data;

      // 12. Проверяем, есть ли email (Clerk присылает массив)
      if (!email_addresses || email_addresses.length === 0) {
        return new Response('No email addresses found', { status: 400 });
      }

      // 13. Берем первый email из массива
      const email = email_addresses[0].email_address;

      // 14. Формируем полное имя (если есть имя и фамилия) или ставим 'User'
      const name = `${first_name || ''} ${last_name || ''}`.trim() || 'User';

      try {
        // 15. Вызываем мутацию Convex для создания пользователя в базе данных
        await ctx.runMutation(api.users.createUser, {
          fullName: name, // Полное имя
          email, // Email
          clerkId: id, // ID пользователя в Clerk
          image: image_url || undefined, // Аватарка (если есть)
          name: email.split('@')[0], // Username (берем часть email до @)
        });
      } catch (error) {
        // 16. Если ошибка при записи в базу — возвращаем 500
        return new Response(`Error creating user: ${error}`, { status: 500 });
      }
    }

    // 17. Возвращаем 200 OK, чтобы Clerk знал, что мы успешно обработали вебхук
    return new Response('OK', { status: 200 });
  }),
});

export default http;
