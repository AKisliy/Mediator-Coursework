import TelegramLoginButton from '@/components/buttons/telegram-login-button';
import { Card, CardTitle } from '@/components/ui/card';

export default function Login() {
  return (
    <div className="flex flex-1 flex-col gap-16 w-full items-center justify-center">
      <h2 className="text-xl sm:text-4xl font-bold">
        Добро пожаловать в Mediator
      </h2>
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
    </div>
  );
}
