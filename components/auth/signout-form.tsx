'use client';

import { signOut } from 'next-auth/react';
import { Button } from '../ui/button';
import CardWrapper from './card-wrapper';

export default function SignoutForm() {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/login' });
  };

  return (
    <CardWrapper
      title="Выход из Mediator"
      description="Вы уверены, что хотите выйти?"
    >
      <div className="flex flex-1 justify-center p-8">
        <Button onClick={handleSignOut} className="w-1/3" variant="destructive">
          Выйти
        </Button>
      </div>
    </CardWrapper>
  );
}
