import bcrypt from 'bcryptjs';
import Credentials from 'next-auth/providers/credentials';

import { LoginSchema } from '@/schemas';

import { prisma } from '../db/prisma';

export const credentialsProvider = Credentials({
  id: 'credentials',
  name: 'Credentials',
  async authorize(credentials) {
    const validatedCredentials = LoginSchema.safeParse(credentials);

    if (!validatedCredentials.success) {
      return null;
    }

    const { email, password } = validatedCredentials.data;

    const user = await prisma.user.findFirst({
      where: {
        email
      }
    });

    if (!user || !user.password) {
      return null;
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (passwordsMatch) {
      return user;
    }

    return null;
  }
});
