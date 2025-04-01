'use server';

import { UserSearch } from '@prisma/client';
import { revalidatePath } from 'next/cache';

import { verifySessionAndGetId } from '@/app/api/auth/utils';
import { prisma } from '@/lib/db/prisma';
import { delay } from '@/lib/utils';
import { transformBloggersFromDb } from '@/models/blogger-mappings';
import { Blogger } from '@/types/blogger';

export async function getUserHistory(
  offset: number = 0,
  count: number = 20
): Promise<UserSearch[] | undefined> {
  const userId = await verifySessionAndGetId();
  await delay(5000);

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

export async function addSearchToHistory(
  id: string,
  query: string,
  bloggers: Blogger[]
): Promise<UserSearch> {
  const userId = await verifySessionAndGetId();
  await delay(5000);

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

export async function getSearchWithBloggers(searchId: string): Promise<{
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

export async function loadMoreSearchEntries(offset: number) {
  return getUserHistory(offset, 10);
}

export async function getUserLastSearch(): Promise<UserSearch | null> {
  const userId = await verifySessionAndGetId();
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
