import * as z from 'zod';

export const RegisterSchema = z
  .object({
    email: z.string().email({
      message: 'Пожалуйста, введите корректный email.'
    }),
    name: z.string().min(1, {
      message: 'Обязательно укажите имя.'
    }),
    password: z.string().min(6, {
      message: 'Пароль должен содержать не менее 6 символов.'
    }),
    passwordConfirmation: z.string().min(6, {
      message: 'Пароль должен содержать не менее 6 символов.'
    })
  })
  .refine(data => data.passwordConfirmation === data.password, {
    message: 'Пароли не совпадают',
    path: ['passwordConfirmation']
  });

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'Пожалуйста, введите корректный email.'
  }),
  password: z.string().min(1, {
    message: 'Пожалуйста, введите корректный пароль.'
  })
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: 'Пожалуйста, введите корректный email.'
  })
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: 'Пароль должен содержать не менее 6 символов.'
  })
});

export const ProfileSchema = z.object({
  name: z.string().min(1, {
    message: 'Обязательно укажите имя.'
  })
});

export const DeleteAccountSchema = z.object({
  deleteAccountPassword: z.string().min(1, {
    message: 'Введите пароль для подтверждения'
  })
});

export const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(6, {
      message: 'Введите текущий пароль'
    }),
    newPassword: z.string().min(6, {
      message: 'Пароль должен содержать не менее 8 символов'
    }),
    confirmPassword: z.string()
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword']
  });
export type PasswordFormSchemaValues = z.infer<typeof passwordFormSchema>;

export const preferencesFormSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  language: z.enum(['ru', 'en'])
});
export type PreferencesFormSchemaValues = z.infer<typeof preferencesFormSchema>;

export const profileSettingsSchema = z.object({
  name: z.string().min(3, {
    message: 'Никнейм должен содержать не менее 3 символов'
  }),
  image: z.string(),
  preivewImage: z.instanceof(File).optional()
});
export type ProfileSettingsSchemaValues = z.infer<typeof profileSettingsSchema>;

export const SettingsFormSchema = z.object({
  name: z.string().min(3, {
    message: 'Никнейм должен содержать не менее 3 символов'
  }),
  image: z.string(),
  theme: z.enum(['light', 'dark', 'system']),
  language: z.enum(['ru', 'en'])
});
