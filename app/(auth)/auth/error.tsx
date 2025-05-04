'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="flex flex-1 flex-col gap-16 w-full items-center justify-center">
      <Card className="flex flex-col items-center justify-center py-16 px-16 gap-16 rounded-2xl">
        <CardTitle className="text-center">
          Произошла ошибка во время авторизации ☹️
        </CardTitle>
        <CardContent className="flex flex-col items-center justify-center gap-8">
          <p className="text-lg">{error}</p>
          <Button asChild>
            <Link href={'/auth/login'}>Попробовать еще раз</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
