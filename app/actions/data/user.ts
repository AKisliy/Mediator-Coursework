'use server';

import { Prisma, User } from '@prisma/client';

import { getContextUserId, withAuth } from '@/lib/auth-wrapper';
import { prisma } from '@/lib/db/prisma';
import { UserSettings } from '@/schemas';
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
  profileData: { name: string; image: string }
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

async function saveUserSettingsAction(settings: UserSettings) {
  const jsonSettings = settings as Prisma.JsonObject;
  const userId = getContextUserId();
  return prisma.user.update({
    where: { id: userId },
    data: {
      settings: jsonSettings
    }
  });
}

async function getUserSettingsAction(): Promise<
  UserSettings | null | undefined
> {
  const userId = getContextUserId();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      settings: true
    }
  });
  const userSettings = user?.settings as UserSettings | null | undefined;
  return userSettings;
}

async function getUserSavedFiltersAction(): Promise<UserFilterSet[]> {
  const id = getContextUserId();
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

export async function deleteAccount(userId: string): Promise<void> {
  await prisma.user.delete({
    where: {
      id: userId
    }
  });
}

export const getUserSavedFilters = withAuth(getUserSavedFiltersAction);
export const saveUserSettings = withAuth(saveUserSettingsAction);
export const getUserSettings = withAuth(getUserSettingsAction);
