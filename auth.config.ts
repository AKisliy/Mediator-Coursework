import { NextAuthConfig } from 'next-auth';
import { credentialsProvider } from './lib/providers/credentials-provider';
import { telegramProvider } from './lib/providers/telegram-provider';

export const authOptions = {
  providers: [telegramProvider, credentialsProvider]
} satisfies NextAuthConfig;
