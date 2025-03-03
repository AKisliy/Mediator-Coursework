'use server';

import { prisma } from '@/lib/db/prisma';
import { Plan } from '@prisma/client';
import { verifySessionAndGetId } from '../api/auth/utils';

export async function getUserPlan(): Promise<Plan | undefined> {
  const userId = await verifySessionAndGetId();
  const response = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      plan: true
    }
  });
  return response?.plan;
}
