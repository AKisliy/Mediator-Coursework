'use client';

import { signIn } from 'next-auth/react';
import { FaYandex } from 'react-icons/fa';

import { Button } from '@/components/ui/button';

export default function YandexButton() {
  const handleSignIn = async () => {
    try {
      await signIn('yandex', { redirectTo: '/' });
    } catch (e: any) {
      console.log(`Something went wrong: ${e.message}`);
    }
  };
  return (
    <Button
      variant="outline"
      type="button"
      className="w-full"
      onClick={handleSignIn}
    >
      <FaYandex className="mr-2" />
    </Button>
  );
}
