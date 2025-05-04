'use server';

import { Prisma, User } from '@prisma/client';

import { verifySessionAndGetId } from '@/app/api/auth/utils';
import { prisma } from '@/lib/db/prisma';
import { UserFilterSet, UserFilterValue } from '@/types/search-filters';

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

export async function saveUserFilter(
  filters: UserFilterValue[],
  userId: string,
  name: string,
  id: string
) {
  const jsonFilters = filters as unknown as Prisma.JsonArray;
  return prisma.userFilter.create({
    data: {
      id,
      userId,
      filters: jsonFilters,
      name
    }
  });
}

export async function getUserSavedFilters(): Promise<UserFilterSet[]> {
  const id = await verifySessionAndGetId();
  const filterSets = await prisma.userFilter.findMany({
    where: {
      userId: id
    }
  });

  const mappedSets = filterSets.map(filterSet => {
    const filters = filterSet.filters as Prisma.JsonArray;
    const mappedFilters = filters.map(f => ({
      id: (f as any)?.id,
      value: (f as any)?.value
    }));
    return {
      name: filterSet.name,
      filters: mappedFilters
    };
  });

  return mappedSets;
}
