import { NextAuthConfig } from 'next-auth';

import { credentialsProvider } from './lib/providers/credentials-provider';
import { telegramProvider } from './lib/providers/telegram-provider';
import { yandexProvider } from './lib/providers/yandex-provider';

export const authOptions = {
  providers: [telegramProvider, credentialsProvider, yandexProvider]
} satisfies NextAuthConfig;
