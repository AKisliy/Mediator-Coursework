'use server';

import { MOCK_USER_ID } from '@/lib/mock/config';
import { prisma } from '@/lib/db/prisma';

export async function getUserReccomendationsCount(): Promise<
  number | undefined
> {
  if (process.env.NEXT_PUBLIC_USE_MOCK_USER === 'true') {
    const response = await prisma.user.findUnique({
      where: {
        id: MOCK_USER_ID
      },
      select: {
        searches_count: true
      }
    });
    return response?.searches_count;
  }
  throw new Error(
    'Auth is not configured yet. Either set NEXT_PUBLIC_USE_MOCK_USER=true, or implement auth'
  );
}
