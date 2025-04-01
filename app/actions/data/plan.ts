'use server';

import { Plan } from '@prisma/client';

import { verifySessionAndGetId } from '@/app/api/auth/utils';
import { prisma } from '@/lib/db/prisma';

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

export async function getUserPlanWithPurchaseDate() {
  const userId = await verifySessionAndGetId();
  const response = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      plan: true,
      planPurchase: true
    }
  });
  return response;
}
