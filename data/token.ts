import { prisma } from '@/lib/db/prisma';

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: email
      }
    });

    return verificationToken;
  } catch (error) {
    console.log(error);
  }
};

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token
      }
    });

    return verificationToken;
  } catch (error) {
    console.log(error);
  }
};
