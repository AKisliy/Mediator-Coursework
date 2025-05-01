'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { Button } from '../ui/button';
import CardWrapper from './card-wrapper';

export default function SignoutForm() {
  const router = useRouter();
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/login' });
  };

  const handleReturn = () => {
    router.back();
  };

  return (
    <CardWrapper
      title="Выход из Mediator"
      description="Вы уверены, что хотите выйти?"
    >
      <div className="flex flex-1 justify-center p-8 gap-2">
        <Button onClick={handleReturn} className="w-1/3" variant="outline">
          Вернуться
        </Button>
        <Button onClick={handleSignOut} className="w-1/3" variant="destructive">
          Выйти
        </Button>
      </div>
    </CardWrapper>
  );
}
