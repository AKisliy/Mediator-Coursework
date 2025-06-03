'use client';

import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { Button } from '../ui/button';
import CardWrapper from './card-wrapper';

export default function SignoutForm() {
  const t = useTranslations('auth.signout');
  const router = useRouter();
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/login' });
  };

  const handleReturn = () => {
    router.back();
  };

  return (
    <CardWrapper title={t('title')} description={t('description')}>
      <div className="flex flex-1 justify-center p-8 gap-2">
        <Button onClick={handleReturn} className="w-1/3" variant="outline">
          {t('goBack')}
        </Button>
        <Button onClick={handleSignOut} className="w-1/3" variant="destructive">
          {t('signOut')}
        </Button>
      </div>
    </CardWrapper>
  );
}
