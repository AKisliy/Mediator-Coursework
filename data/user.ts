'use server';

import { User } from '@prisma/client';

import { prisma } from '@/lib/db/prisma';

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

export async function updateUserProfileInformation(
  id: string,
  profileData: Partial<User>
) {
  return prisma.user.update({
    where: {
      id
    },
    data: {
      ...profileData
    }
  });
}
