'use server';

import { signIn } from '@/auth';
import { getVerificationTokenByToken } from '@/data/token';
import { getUserByEmail } from '@/data/user';
import { prisma } from '@/lib/db/prisma';
import { LoginSchema } from '@/schemas';
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

  try {
    await signIn('credentials', {
      email: userExists.email,
      password,
      redirectTo: '/'
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials' };
        default:
          return { error: 'Please confirm yours email address' };
      }
    }
  }

  return { success: 'User logged in successfully' };
};
