import z from 'zod';

export const registerSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Имя должно быть не менее 3 символов' })
    .max(20, { message: 'Имя должно быть не более 20 символов' }),
  email: z.email({ message: 'Некорректный email адрес' }),
  password: z
    .string()
    .min(6, { message: 'Пароль должен быть не менее 6 символов' })
    .max(20, { message: 'Пароль должен быть не более 20 символов' }),
});

export type TypeRegisterSchema = z.infer<typeof registerSchema>;
