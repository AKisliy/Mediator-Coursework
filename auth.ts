import CredentialsProvider from 'next-auth/providers/credentials';
import { objectToAuthDataMap, AuthDataValidator } from '@telegram-auth/server';
import { createUserOrUpdate } from '@/lib/db/prisma';
import { Session, NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'telegram-login',
      name: 'Telegram Login',
      credentials: {},
      async authorize(credentials, req) {
        const validator = new AuthDataValidator({
          botToken: `${process.env.BOT_TOKEN}`
        });
        const data = objectToAuthDataMap(req.query || {});
        const user = await validator.validate(data);

        if (user.id && user.first_name) {
          const returned = {
            id: user.id.toString(),
            email: user.id.toString(),
            name: [user.first_name, user.last_name || ''].join(' '),
            image: user.photo_url,
            username: user.username
          };

          try {
            await createUserOrUpdate(user);
          } catch (e: any) {
            console.log(`Error occured while creating the user: ${e.message}`); // логировать в БД?
            throw new Error('Произошла ошибка сохранения в БД!');
          }

          return returned;
        }
        return null;
      }
    })
  ],
  callbacks: {
    async session({ session }: { session: Session }) {
      if (session && session.user) session.user.id = session?.user?.email;
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/signout',
    error: '/auth/error'
  }
};
