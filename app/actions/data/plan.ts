'use server';

import { Plan } from '@prisma/client';

import { getContextUserId, withAuth } from '@/lib/auth-wrapper';
import { prisma } from '@/lib/db/prisma';
import { Plan as PlanType } from '@/types/plan';

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

export async function getAllPlans(): Promise<PlanType[] | undefined> {
  const response = await prisma.plan.findMany();
  return response
    .map(plan => ({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      monthlyLimit: plan.monthly_limit,
      planFeatures: plan.plan_features?.split(';') || [],
      description: plan.description || ''
    }))
    .filter(plan => plan.id !== Number(process.env.DEV_PLAN_ID));
}

export const getUserPlan = withAuth(getUserPlanAction);
export const getUserPlanWithPurchaseDate = withAuth(
  getUserPlanWithPurchaseDateAction
);
