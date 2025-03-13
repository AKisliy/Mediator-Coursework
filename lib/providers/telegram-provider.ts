import { AuthDataValidator, objectToAuthDataMap } from '@telegram-auth/server';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createUserOrUpdate } from '../db/prisma';

export const telegramProvider = CredentialsProvider({
  id: 'telegram-login',
  name: 'Telegram Login',
  credentials: {},
  async authorize(_, req) {
    const url = new URL(req.url);
    const params = url.searchParams;
    const res: Record<string, string | number> = {};
    params.forEach((value, key) => {
      res[key] = value;
    });
    const validator = new AuthDataValidator({
      botToken: `${process.env.BOT_TOKEN}`
    });
    const data = objectToAuthDataMap(res);
    const user = await validator.validate(data);

    if (user.id && user.first_name) {
      const returned = {
        id: user.id.toString(),
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
});
