'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

export default function AuthError() {
  const t = useTranslations('auth.error.page');
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="flex flex-1 flex-col gap-16 w-full items-center justify-center">
      <Card className="flex flex-col items-center justify-center py-16 px-16 gap-16 rounded-2xl">
        <CardTitle className="text-center">{t('title')}</CardTitle>
        <CardContent className="flex flex-col items-center justify-center gap-8">
          <p className="text-lg">{error}</p>
          <Button asChild>
            <Link href={'/auth/login'}>{t('retryButton')}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
