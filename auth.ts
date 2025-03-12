import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth, { Session } from 'next-auth';
import { getUserById } from './app/actions/user.action';
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

      const existingUser = await getUserById(user.id ?? '');

      if (!existingUser?.emailVerified) {
        return false;
      }

      return true;
    },
    async session({ session }: { session: Session }) {
      if (session && session.user) session.user.id = session?.user?.email;
      return session;
    }
  },
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/signout',
    error: '/auth/error'
  },
  ...authOptions
});
