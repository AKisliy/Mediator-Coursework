'use server';

import { getContextUserId, withAuth } from '@/lib/auth-wrapper';
import { prisma } from '@/lib/db/prisma';

export async function getUserReccomendationsCountAction(): Promise<
  number | undefined
> {
  const userId = getContextUserId();
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

async function updateUserReccomendationsCountAction(
  count: number
): Promise<void> {
  const userId = getContextUserId();
  await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      searches_count: count
    }
  });
}

export const updateUserReccomendationsCount = withAuth(
  updateUserReccomendationsCountAction
);
export const getUserReccomendationsCount = withAuth(
  getUserReccomendationsCountAction
);
