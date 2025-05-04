import { v4 } from 'uuid';

import { prisma } from '@/lib/db/prisma';

export const createRefreshToken = async (userId: string) => {
  const newToken = v4();
  const expiresDate = new Date(
    Date.now() + process.env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000
  );
  await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      refreshToken: newToken,
      refreshTokenExpires: expiresDate
    }
  });
  return newToken;
};

export const getRefreshToken = async (userId: string | undefined) => {
  const userData = await prisma.user.findFirst({
    where: { id: userId },
    select: { refreshToken: true, refreshTokenExpires: true }
  });

  return userData;
};
