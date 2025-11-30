import z from 'zod';

export const loginSchema = z.object({
  email: z.email({ message: 'Некорректный email адрес' }),
  password: z
    .string()
    .min(6, { message: 'Пароль должен быть не менее 6 символов' })
    .max(20, { message: 'Пароль должен быть не более 20 символов' }),
});

export type LoginSchema = z.infer<typeof loginSchema>;
