import YandexProvider from 'next-auth/providers/yandex';

export const yandexProvider = YandexProvider({
  name: 'yandex',
  clientId: process.env.NEXT_PUBLIC_YANDEX_CLIENT_ID,
  clientSecret: process.env.YANDEX_CLIENT_SECRET
});
