import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import { cookies } from 'next/headers';

import { refreshAccessToken } from './app/actions/auth.action';
import { createRefreshToken } from './app/actions/data/refresh-token';
import { authOptions } from './auth.config';
import { prisma } from './lib/db/prisma';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth({
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'credentials') {
        return true;
      }

      const existingUser = await prisma.user.findFirst({
        where: {
          id: user.id
        }
      });

      if (!existingUser?.emailVerified) {
        return false;
      }

      return true;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          image: token.picture
        }
      };
    },
    async jwt({ token, user, trigger, session, account }) {
      if (!token.sub) return token;
      if (trigger === 'update') {
        if (session?.name) token.name = session.name;
        if (session?.image) token.picture = session.image;
        if (session?.refreshToken) {
          token.refresh_token = session.refreshToken;
          token.expires_at = new Date(
            Date.now() + process.env.ACCESS_TOKEN_TTL_SEC * 1000
          );
        }
      }
      if (account?.provider === 'yandex') {
        token.access_token = account.access_token || '';
        token.id = account.cid;
      }
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
        token.refresh_token = await createRefreshToken(token.sub);
        token.expires_at = new Date(
          Date.now() + process.env.ACCESS_TOKEN_TTL_SEC * 1000
        );
      }

      const expires = token.expires_at;

      if (expires > new Date()) {
        return token;
      }

      const refreshedToken = await refreshAccessToken(token);

      if (!refreshedToken) {
        cookies().set('sessionExpired', 'true', {
          maxAge: 60,
          httpOnly: false
        });
        return null;
      }

      return refreshedToken;
    }
  },
  session: {
    strategy: 'jwt'
  },
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: '/auth/login',
    // signOut: '/auth/signout',
    error: '/auth/error'
  },
  ...authOptions
});
