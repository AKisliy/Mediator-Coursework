'use server';

import { verifySessionAndGetId } from '@/app/api/auth/utils';
import { prisma } from '@/lib/db/prisma';

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
