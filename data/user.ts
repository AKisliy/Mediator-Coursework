'use server';

import { prisma } from '@/lib/db/prisma';
import { User } from '@prisma/client';

export async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findFirst({
    where: {
      email
    }
  });
}

export async function getUserById(id: string): Promise<User | null> {
  return prisma.user.findFirst({
    where: {
      id
    }
  });
}
