'use server';

import { prisma } from '@/lib/db/prisma';
import { MOCK_USER_ID } from '@/lib/mock/config';
import { delay } from '@/lib/utils';
import { UserSearch } from '@prisma/client';

export async function getUserHistory(): Promise<UserSearch[] | undefined> {
  if (process.env.NEXT_PUBLIC_USE_MOCK_USER === 'true') {
    await delay(5000);
    const response = await prisma.user.findUnique({
      where: {
        id: MOCK_USER_ID
      },
      select: {
        searches: true
      }
    });
    return response?.searches;
  }
  throw new Error(
    'Auth is not configured yet. Either set NEXT_PUBLIC_USE_MOCK_USER=true, or implement auth'
  );
}
