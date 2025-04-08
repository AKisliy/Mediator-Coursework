import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';

import { refreshAccessToken } from './app/actions/auth.action';
import { createRefreshToken } from './app/actions/data/refresh-token';
import { authOptions } from './auth.config';
import { prisma } from './lib/db/prisma';

// async function refreshAccessToken(token) {
//   console.log('UPDATE')
//   const refresh = await axios
//     .post('/token/refresh/', {
//       refresh: token.refreshToken
//     })
//     .catch((error) => {
//       console.log(error)
//     })
//   if (refresh && refresh.status === 200 && refresh.data.access) {
//     return {
//       ...token,
//       accessToken: refresh.data.access,
//       expiresAt: Date.now() + 10 * 1000
//     }
//   }
//   return {
//     ...token,
//     error: 'RefreshAccessTokenError'
//   }
// }

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
    async jwt({ token, user }) {
      if (!token.sub) return token;
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.refresh_token = await createRefreshToken(token.sub);
        token.expires_at = new Date(
          Date.now() + process.env.ACCESS_TOKEN_TTL_SEC * 1000
        );
      }

      const expires = token.expires_at;

      if (expires > new Date()) {
        return token;
      }

      return refreshAccessToken(token);
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
