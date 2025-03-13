'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FaTelegram } from 'react-icons/fa';

export default function TelegramButton() {
  return (
    <Button variant="outline" type="button" className="w-full" asChild>
      <Link href="/auth/telegram">
        <FaTelegram />
        <span className="sr-only">{'Login with Telegram'}</span>
      </Link>
    </Button>
  );
}
