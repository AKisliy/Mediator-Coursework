'use server';

import { Plan } from '@prisma/client';

import { getContextUserId, withAuth } from '@/lib/auth-wrapper';
import { prisma } from '@/lib/db/prisma';

async function getUserPlanAction(): Promise<Plan | undefined> {
  const userId = getContextUserId();
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

async function getUserPlanWithPurchaseDateAction() {
  const userId = getContextUserId();
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

export const getUserPlan = withAuth(getUserPlanAction);
export const getUserPlanWithPurchaseDate = withAuth(
  getUserPlanWithPurchaseDateAction
);
