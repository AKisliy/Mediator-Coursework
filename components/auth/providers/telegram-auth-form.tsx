'use client';

import { useTranslations } from 'next-intl';

import TelegramLoginButton from '@/components/buttons/telegram-login-button';

import CardWrapper from '../card-wrapper';

export default function TelegramAuthForm() {
  const t = useTranslations('auth.providers.telegram');
  return (
    <CardWrapper
      title={t('title')}
      description={t('description')}
      includeBackButton={true}
    >
      <div className="flex flex-1 justify-center p-16">
        <TelegramLoginButton />
      </div>
    </CardWrapper>
  );
}
