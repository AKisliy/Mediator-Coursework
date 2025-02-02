'use server';

import { MOCK_USER_ID } from '@/lib/mock/config';
import { prisma } from '@/lib/prisma';
import { Plan } from '@prisma/client';

export async function getUserPlan(): Promise<Plan | undefined> {
  if (process.env.NEXT_PUBLIC_USE_MOCK_USER === 'true') {
    const response = await prisma.user.findUnique({
      where: {
        id: MOCK_USER_ID
      },
      select: {
        plan: true
      }
    });
    return response?.plan;
  }
  throw new Error(
    'Auth is not configured yet. Either set NEXT_PUBLIC_USE_MOCK_USER=true, or implement auth'
  );
}
