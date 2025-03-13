'use client';

import { LoginButton, TelegramAuthData } from '@telegram-auth/react';
import { signIn } from 'next-auth/react';

export default function TelegramLoginButton() {
  const handleSignIn = async (data: TelegramAuthData) => {
    try {
      await signIn('telegram-login', { callbackUrl: '/' }, data as any);
    } catch (e: any) {
      console.log(`Something went wrong: ${e.message}`);
    }
  };

  return (
    <LoginButton
      botUsername={process.env.NEXT_PUBLIC_BOT_USERNAME}
      onAuthCallback={data => {
        handleSignIn(data);
      }}
    />
  );
}
