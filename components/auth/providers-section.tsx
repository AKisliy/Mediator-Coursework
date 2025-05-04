import TelegramButton from './providers/telegram-button';
import YandexButton from './providers/yandex-button';

export default function ProvidersSection() {
  return (
    <>
      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          Или используйте
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <TelegramButton />
        <YandexButton />
      </div>
    </>
  );
}
