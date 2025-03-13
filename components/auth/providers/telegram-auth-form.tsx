'use client';

import TelegramLoginButton from '@/components/buttons/telegram-login-button';
import CardWrapper from '../card-wrapper';

export default function TelegramAuthForm() {
  return (
    <CardWrapper
      title="Вход через Telegram"
      description="Дайте разрешения нашему боту, чтобы продолжить"
    >
      <div className="flex flex-1 justify-center p-16">
        <TelegramLoginButton />
      </div>
    </CardWrapper>
  );
}
