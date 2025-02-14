'use client';

import { Card, CardTitle } from '@/components/ui/card';
import TelegramLoginButton from '../buttons/telegram-login-button';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <Card className="flex flex-col items-center justify-center py-16 px-16 gap-16 rounded-2xl">
      <CardTitle className="text-center">
        Авторизуйтесь, чтобы продолжить.
      </CardTitle>
      <TelegramLoginButton
        botUsername={
          process.env.NEXT_PUBLIC_BOT_USERNAME ?? 'Bot not registered'
        }
      />
    </Card>
  );
}
