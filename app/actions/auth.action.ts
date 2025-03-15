'use server';

import { signIn } from '@/auth';
import { getPasswordResetTokenByToken } from '@/data/reset-token';
import { getVerificationTokenByToken } from '@/data/token';
import { getUserByEmail } from '@/data/user';
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
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import { z } from 'zod';

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
    return { error: 'Invalid token' };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: 'Token has expired' };
  }

  const existingUser = await getUserByEmail(existingToken.identifier);

  if (!existingUser) {
    return { error: 'User not found' };
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

  return { success: 'Email verified' };
};

export const login = async (data: z.infer<typeof LoginSchema>) => {
  const validatedData = LoginSchema.parse(data);

  if (!validatedData) {
    return { error: 'Invalid input data' };
  }

  const { email, password } = validatedData;

  const userExists = await getUserByEmail(email);

  // If the user does not exist, return an error
  if (!userExists || !userExists.email || !userExists.password) {
    return { error: 'User does not exist' };
  }

  console.log('Authorizing user');

  try {
    await signIn('credentials', {
      email: userExists.email,
      password,
      redirectTo: '/'
    });
    console.log('User authenticated');
  } catch (error: any) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials' };
        default:
          return { error: 'Please confirm yours email address' };
      }
    }
    throw error;
  }

  return { success: 'User logged in successfully' };
};

export const register = async (data: z.infer<typeof RegisterSchema>) => {
  try {
    const validatedData = RegisterSchema.parse(data);

    if (!validatedData) {
      return { error: 'Invalid input data' };
    }

    const { email, name, password, passwordConfirmation } = validatedData;

    if (password !== passwordConfirmation) {
      return { error: 'Passwords do not match' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userExists = await getUserByEmail(email);

    if (userExists) {
      return { error: 'Email already is in use. Please try another one.' };
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

    // Generate a verification token
    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(
      email,
      verificationToken.token,
      'http://localhost:3000',
      nodemailerConfig
    );

    return { success: 'Email Verification was sent' };
  } catch (error) {
    // Handle the error, specifically check for a 503 error
    console.error('Database error:', error);

    if ((error as { code: string }).code === 'ETIMEDOUT') {
      return {
        error: 'Unable to connect to the database. Please try again later.'
      };
    }
    if ((error as { code: string }).code === '503') {
      return {
        error: 'Service temporarily unavailable. Please try again later.'
      };
    }
    return { error: 'An unexpected error occurred. Please try again later.' };
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

  console.log('user updated');

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
