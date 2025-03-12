'use server';

import { verifySessionAndGetId } from '@/app/api/auth/utils';
import { prisma } from '@/lib/db/prisma';
import { User } from '@prisma/client';

export async function getUserReccomendationsCount(): Promise<
  number | undefined
> {
  const userId = await verifySessionAndGetId();
  const response = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      searches_count: true
    }
  });
  return response?.searches_count;
}

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
