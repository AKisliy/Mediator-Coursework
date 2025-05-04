import { prisma } from '@/lib/db/prisma';

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await prisma.passwordResetToken.findFirst({
      where: {
        identifier: email
      }
    });

    return passwordResetToken;
  } catch (error) {
    console.log(error);
  }
};

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await prisma.passwordResetToken.findFirst({
      where: {
        token
      }
    });

    return passwordResetToken;
  } catch (error) {
    console.log(error);
  }
};
