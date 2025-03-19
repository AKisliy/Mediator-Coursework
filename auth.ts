import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';

import { authOptions } from './auth.config';
import { getUserById } from './data/user';
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

      const existingUser = await getUserById(user.id ?? '');

      if (!existingUser?.emailVerified) {
        return false;
      }

      return true;
    },
    async session({ session, token }) {
      // if (session && session.user) session.user.id = session?.user?.email;
      // console.log(session);
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub
        }
      };
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;
      token.name = existingUser.name;
      token.email = existingUser.email;
      // Note, that `session` can be any arbitrary object, remember to validate it!
      token.picture = existingUser.image;

      return token;
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
