'use server';

import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import { getTranslations } from 'next-intl/server';
import type { z } from 'zod';

import { getPasswordResetTokenByToken } from '@/app/actions/data/reset-token';
import { getVerificationTokenByToken } from '@/app/actions/data/token';
import { getUserByEmail } from '@/app/actions/data/user';
import { signIn } from '@/auth';
import { getContextUserId } from '@/lib/auth-context';
import { withAuth } from '@/lib/auth-wrapper';
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

import { generateRefreshToken, getRefreshToken } from './data/refresh-token';

export async function authenticate(prevState: any, formData: FormData) {
  const t = await getTranslations('auth.errors');

  try {
    const email = formData.get('email') as string;

    if (!email || !email.includes('@')) {
      return {
        error: t('invalidEmail')
      };
    }

    await signIn('email', { callbackUrl: '/', email });

    return {
      success: true
    };
  } catch (error) {
    return {
      error: t('emailLinkError')
    };
  }
}

export const proceedVerification = async (token: string) => {
  const t = await getTranslations('auth.errors');

  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: t('tokenNotFound') };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: t('invalidToken') };
  }

  const existingUser = await getUserByEmail(existingToken.identifier);

  if (!existingUser) {
    return { error: t('userNotFound') };
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

  return { success: t('emailVerified') };
};

export const login = async (data: z.infer<typeof LoginSchema>) => {
  const t = await getTranslations('auth.errors');

  const validatedData = LoginSchema.safeParse(data);

  if (!validatedData.success) {
    return { error: t('invalidData') };
  }

  const { email, password } = validatedData.data;

  const userExists = await getUserByEmail(email);

  // If the user does not exist, return an error
  if (!userExists || !userExists.email || !userExists.password) {
    return { error: t('userDoesNotExist') };
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
          return { error: t('invalidCredentials') };
        default:
          return { error: t('confirmEmail') };
      }
    }
    throw error;
  }

  return { success: t('loginSuccess') };
};

export const register = async (data: z.infer<typeof RegisterSchema>) => {
  const t = await getTranslations('auth.errors');

  try {
    const validatedData = RegisterSchema.safeParse(data);

    if (!validatedData.success) {
      return { error: t('invalidInputFormat') };
    }

    const { email, name, password } = validatedData.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const userExists = await getUserByEmail(email);

    if (userExists) {
      return { error: t('emailAlreadyExists') };
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

    return { success: t('verificationEmailSent') };
  } catch (error) {
    console.error('Database error:', error);

    if ((error as { code: string }).code === 'ETIMEDOUT') {
      return {
        error: t('databaseConnectionError')
      };
    }
    if ((error as { code: string }).code === '503') {
      return {
        error: t('serviceUnavailable')
      };
    }
    return { error: t('unexpectedError') };
  }
};

export const resetPassword = async (data: z.infer<typeof ResetSchema>) => {
  const t = await getTranslations('auth.errors');

  const validatedData = ResetSchema.safeParse(data);

  if (!validatedData.success) {
    return { error: t('invalidEmail') };
  }

  const { email } = validatedData.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) return { success: t('resetLinkSent') };

  const token = await generatePasswordResetToken(email);
  await sendResetPasswordEmail(
    token.identifier,
    token.token,
    'http://localhost:3000',
    nodemailerConfig
  );

  return { success: t('resetLinkSent') };
};

export const setNewPassword = async (
  data: z.infer<typeof NewPasswordSchema>,
  token: string | null
) => {
  const t = await getTranslations('auth.errors');

  if (!token) return { error: t('tokenNotFound') };
  console.log(token);

  const validatedData = NewPasswordSchema.safeParse(data);
  if (!validatedData.success) return { error: t('invalidFields') };

  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) return { error: t('tokenDoesNotExist') };

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) return { error: t('tokenExpired') };

  const userEmail = existingToken.identifier;
  const existingUser = await getUserByEmail(userEmail);
  if (!existingUser) return { error: t('userNotFound') };

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

  return { success: t('passwordUpdated') };
};

export const refreshAccessToken = async (token: JWT) => {
  const tokenInDb = await getRefreshToken(token.sub);

  if (!tokenInDb) return null;

  if (tokenInDb.refreshToken !== token.refresh_token) return null;

  if (
    !tokenInDb.refreshTokenExpires ||
    tokenInDb.refreshTokenExpires < new Date()
  )
    return null;

  const newAccessToken = {
    ...token,
    expiresAt: new Date(Date.now() + process.env.ACCESS_TOKEN_TTL_SEC * 1000)
  };

  return newAccessToken;
};

const checkPasswordAction = async (password: string): Promise<boolean> => {
  const userId = getContextUserId();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { password: true }
  });

  const hashedPassword = user?.password;

  return bcrypt.compare(password, hashedPassword || '');
};

const changePasswordAction = async (
  newPassword: string
): Promise<{ newRefreshToken: string }> => {
  const userId = getContextUserId();

  const newHashedPassword = await bcrypt.hash(newPassword, 10);

  const { token, expires } = generateRefreshToken();

  await prisma.user.update({
    where: { id: userId },
    data: {
      password: newHashedPassword,
      refreshToken: token,
      refreshTokenExpires: expires
    }
  });

  return { newRefreshToken: token };
};

export const checkPassword = withAuth(checkPasswordAction);
export const changePassword = withAuth(changePasswordAction);
