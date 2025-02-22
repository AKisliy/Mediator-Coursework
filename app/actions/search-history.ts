'use server';

import { prisma } from '@/lib/db/prisma';
import { MOCK_USER_ID } from '@/lib/mock/config';
import { delay } from '@/lib/utils';
import { BloggerResponseDTO } from '@/models/response/blogger-dto';
import { Blogger, UserSearch } from '@prisma/client';

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

export async function addSearchToHistory(
  id: string,
  query: string,
  bloggers: BloggerResponseDTO[]
): Promise<UserSearch> {
  if (process.env.NEXT_PUBLIC_USE_MOCK_USER === 'true') {
    await delay(5000);

    return prisma.userSearch.create({
      data: {
        id,
        query,
        userId: MOCK_USER_ID,
        bloggers: {
          connectOrCreate: bloggers.map(blogger => ({
            where: { id: blogger.id },
            create: {
              id: blogger.id,
              username: blogger.metadata.username,
              image_link: blogger.metadata.image_link,
              followers_count: blogger.metadata.followers_count,
              social_media: blogger.metadata.social_media,
              category: blogger.metadata.category,
              description: blogger.metadata.description
            }
          }))
        }
      }
    });
  }
  throw new Error(
    'Auth is not configured yet. Either set NEXT_PUBLIC_USE_MOCK_USER=true, or implement auth'
  );
}

export async function getSearchWithBloggers(searchId: string): Promise<{
  query: string;
  createdAt: Date;
  bloggers: Blogger[] | null;
} | null> {
  const res = await prisma.userSearch.findFirst({
    where: {
      id: searchId
    },
    include: {
      bloggers: true
    }
  });
  if (res?.bloggers) res.bloggers = res?.bloggers as Blogger[];
  return res;
}
