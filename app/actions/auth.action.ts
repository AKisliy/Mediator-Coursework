'use server';

import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { z } from 'zod';

import { getPasswordResetTokenByToken } from '@/app/actions/data/reset-token';
import { getVerificationTokenByToken } from '@/app/actions/data/token';
import { getUserByEmail } from '@/app/actions/data/user';
import { signIn } from '@/auth';
import { prisma } from '@/lib/db/prisma';
import { sendResetPasswordEmail, sendVerificationEmail } from '@/lib/mail';
import { nodemailerConfig } from '@/lib/providers/email-provider';
import {
  generatePasswordResetToken,
  generateVerificationToken
} from '@/lib/tokens';
import { generateAvatar, generateUniqueUsername } from '@/lib/utils';
import {
  LoginSchema,
  NewPasswordSchema,
  RegisterSchema,
  ResetSchema
} from '@/schemas';

import { getRefreshToken } from './data/refresh-token';

export async function authenticate(prevState: any, formData: FormData) {
  try {
    const email = formData.get('email') as string;

    if (!email || !email.includes('@')) {
      return {
        error: 'Пожалуйста, введите корректный email адрес'
      };
    }

    await signIn('email', { callbackUrl: '/', email });

    return {
      success: true
    };
  } catch (error) {
    return {
      error:
        'Произошла ошибка при отправке ссылки. Пожалуйста, попробуйте снова.'
    };
  }
}

export const proceedVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: 'Токен не найден.' };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: 'Недействительный токен' };
  }

  const existingUser = await getUserByEmail(existingToken.identifier);

  if (!existingUser) {
    return { error: 'Пользователь с вашим email не найден' };
  }

  await prisma.user.update({
    where: {
      id: existingUser.id
    },
    data: {
      emailVerified: new Date(),
      email: existingToken.identifier
    }
  });

  await prisma.verificationToken.delete({
    where: {
      identifier_token: {
        identifier: existingToken.identifier,
        token: existingToken.token
      }
    }
  });

  return { success: 'Почта подтверждена ✅' };
};

export const login = async (data: z.infer<typeof LoginSchema>) => {
  const validatedData = LoginSchema.safeParse(data);

  if (!validatedData.success) {
    return { error: 'Введены некорректные данные' };
  }

  const { email, password } = validatedData.data;

  const userExists = await getUserByEmail(email);

  // If the user does not exist, return an error
  if (!userExists || !userExists.email || !userExists.password) {
    return { error: 'Пользователя с таким аккаунтом не существует' };
  }

  try {
    await signIn('credentials', {
      email: userExists.email,
      password,
      redirectTo: '/'
    });
  } catch (error: any) {
    if (error instanceof AuthError) {
      switch (error.name) {
        case 'CredentialsSignin':
          return { error: 'Указаны неверные данные' };
        default:
          return { error: 'Пожалуйста, подтвердите свой email' };
      }
    }
    throw error;
  }

  return { success: 'Успешный вход' };
};

export const register = async (data: z.infer<typeof RegisterSchema>) => {
  try {
    const validatedData = RegisterSchema.safeParse(data);

    if (!validatedData.success) {
      return { error: 'Неверный формат входных данных' };
    }

    const { email, name, password } = validatedData.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const userExists = await getUserByEmail(email);

    if (userExists) {
      return { error: 'Пользователь с таким email уже существует' };
    }

    const lowerCaseEmail = email.toLowerCase();
    const username = generateUniqueUsername();
    const avatartUri = generateAvatar(name);

    await prisma.user.create({
      data: {
        email: lowerCaseEmail,
        name,
        username,
        password: hashedPassword,
        image: avatartUri
      }
    });

    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(
      email,
      verificationToken.token,
      'http://localhost:3000',
      nodemailerConfig
    );

    return { success: 'Письмо для подтверждения отправлено на почту' };
  } catch (error) {
    console.error('Database error:', error);

    if ((error as { code: string }).code === 'ETIMEDOUT') {
      return {
        error: 'Не удается подключиться к базе данных. Повторите позже'
      };
    }
    if ((error as { code: string }).code === '503') {
      return {
        error: 'Сервис временно недоступен. Повторите попытку позже.'
      };
    }
    return { error: 'Произошла непредвиденная ошибка. Попробуйте позднее.' };
  }
};

export const resetPassword = async (data: z.infer<typeof ResetSchema>) => {
  const validatedData = ResetSchema.safeParse(data);

  if (!validatedData.success) {
    return { error: 'Неверный email' };
  }

  const { email } = validatedData.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) return { success: 'Ссылка отправлена на почту' };

  const token = await generatePasswordResetToken(email);
  await sendResetPasswordEmail(
    token.identifier,
    token.token,
    'http://localhost:3000',
    nodemailerConfig
  );

  return { success: 'Ссылка отправлена на почту' };
};

export const setNewPassword = async (
  data: z.infer<typeof NewPasswordSchema>,
  token: string | null
) => {
  if (!token) return { error: 'Токен не найден' };
  console.log(token);

  const validatedData = NewPasswordSchema.safeParse(data);
  if (!validatedData.success) return { error: 'Некорректно заполнены поля' };

  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) return { error: 'Токен не существует' };

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) return { error: 'Действие токена закончилось' };

  const userEmail = existingToken.identifier;
  const existingUser = await getUserByEmail(userEmail);
  if (!existingUser) return { error: 'Пользователь с email не найден' };

  const { password } = validatedData.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: {
      id: existingUser.id
    },
    data: {
      password: hashedPassword
    }
  });

  await prisma.passwordResetToken.delete({
    where: {
      identifier_token: {
        identifier: existingToken.identifier,
        token: existingToken.token
      }
    }
  });

  return { success: 'Пароль успешно обновлен' };
};

export const refreshAccessToken = async (token: JWT) => {
  const tokenInDb = await getRefreshToken(token.sub);

  if (!tokenInDb) throw new Error('Refresh токен пользователя не найден');

  if (tokenInDb.refreshToken !== token.refresh_token)
    throw new Error('Refresh токены не совпадают');

  if (
    !tokenInDb.refreshTokenExpires ||
    tokenInDb.refreshTokenExpires < new Date()
  )
    throw new Error('Действие Refresh токена истекло');

  const newAccessToken = {
    ...token,
    expiresAt: new Date(Date.now() + process.env.ACCESS_TOKEN_TTL_SEC * 1000)
  };

  return newAccessToken;
};
