'use server';

import { UserSearch } from '@prisma/client';
import { revalidatePath } from 'next/cache';

import { getContextUserId, withAuth } from '@/lib/auth-wrapper';
import { prisma } from '@/lib/db/prisma';
import { transformBloggersFromDb } from '@/models/blogger-mappings';
import { Blogger } from '@/types/blogger';

async function getUserHistoryAction(
  offset: number = 0,
  count: number = 20
): Promise<UserSearch[] | undefined> {
  const userId = getContextUserId();

  const response = await prisma.userSearch.findMany({
    where: {
      userId
    },
    skip: offset,
    take: count,
    orderBy: {
      createdAt: 'desc'
    }
  });
  return response;
}

export async function addSearchToHistoryAction(
  id: string,
  query: string,
  bloggers: Blogger[]
): Promise<UserSearch> {
  const userId = getContextUserId();

  const newSearch = prisma.userSearch.create({
    data: {
      id,
      query,
      userId,
      bloggers: {
        connectOrCreate: bloggers.map(blogger => ({
          where: { id: blogger.id },
          create: {
            id: blogger.id,
            username: blogger.username,
            image_link: blogger.image_link,
            followers_count: blogger.followers_count,
            social_media: blogger.social_media,
            category: blogger.category,
            description: blogger.description
          }
        }))
      }
    }
  });

  revalidatePath('/history');
  revalidatePath('/profile');
  return newSearch;
}

async function getSearchWithBloggersAction(searchId: string): Promise<{
  query?: string;
  createdAt?: Date;
  bloggers?: Blogger[];
} | null> {
  const response = await prisma.userSearch.findFirst({
    where: {
      id: searchId
    },
    include: {
      bloggers: true
    }
  });
  const bloggers = transformBloggersFromDb(response?.bloggers || []);
  const result = {
    query: response?.query ?? 'Unknown',
    createdAt: response?.createdAt,
    bloggers
  };
  return result;
}

async function loadMoreSearchEntriesAction(offset: number) {
  return getUserHistory(offset, 10);
}

async function getUserLastSearchAction(): Promise<UserSearch | null> {
  const userId = getContextUserId();
  const lastSearch = await prisma.userSearch.findFirst({
    where: {
      userId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  return lastSearch;
}

export const getUserHistory = withAuth(getUserHistoryAction);
export const addSearchToHistory = withAuth(addSearchToHistoryAction);
export const getUserLastSearch = withAuth(getUserLastSearchAction);
export const getSearchWithBloggers = withAuth(getSearchWithBloggersAction);
export const loadMoreSearchEntries = withAuth(loadMoreSearchEntriesAction);
