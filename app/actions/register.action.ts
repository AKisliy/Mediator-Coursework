'use server';

import { getUserByEmail } from '@/data/user';
import { prisma } from '@/lib/db/prisma';
import { sendVerificationEmail } from '@/lib/mail';
import { nodemailerConfig } from '@/lib/providers/email-provider';
import { generateVerificationToken } from '@/lib/utils';
import { RegisterSchema } from '@/schemas';
import bcrypt from 'bcryptjs';
import * as z from 'zod';

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

    const user = await prisma.user.create({
      data: {
        email: lowerCaseEmail,
        name,
        password: hashedPassword
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
