import { getPasswordResetTokenByEmail } from '@/data/reset-token';
import { getVerificationTokenByEmail } from '@/data/token';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from './db/prisma';

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date().getTime() + 1000 * 60 * 60 * 1;

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: existingToken.identifier,
          token: existingToken.token
        }
      }
    });
  }

  const verificationToken = await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires: new Date(expires)
    }
  });

  return verificationToken;
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date().getTime() + 1000 * 60 * 60 * 1;

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await prisma.passwordResetToken.delete({
      where: {
        identifier_token: {
          identifier: existingToken.identifier,
          token: existingToken.token
        }
      }
    });
  }

  const verificationToken = await prisma.passwordResetToken.create({
    data: {
      identifier: email,
      token,
      expires: new Date(expires)
    }
  });

  return verificationToken;
};
