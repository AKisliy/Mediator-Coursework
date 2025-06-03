'use client';

import { LoginButton, TelegramAuthData } from '@telegram-auth/react';
import { signIn } from 'next-auth/react';
import { useLocale } from 'next-intl';

export default function TelegramLoginButton() {
  const locale = useLocale();
  const handleSignIn = async (data: TelegramAuthData) => {
    try {
      await signIn('telegram-login', { redirectTo: '/' }, data as any);
    } catch (e: any) {
      console.log(`Something went wrong: ${e.message}`);
    }
  };

  return (
    <LoginButton
      botUsername={process.env.NEXT_PUBLIC_BOT_USERNAME}
      lang={locale}
      onAuthCallback={data => {
        handleSignIn(data);
      }}
    />
  );
}
