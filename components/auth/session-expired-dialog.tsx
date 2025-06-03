'use client';

import { Timer } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

export default function SessionExpiredDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const t = useTranslations('auth.sessionExpired');

  useEffect(() => {
    const urlExpired = searchParams.get('sessionExpired') === 'true';

    if (urlExpired) {
      setIsOpen(true);
      if (urlExpired) {
        const url = new URL(window.location.href);
        url.searchParams.delete('sessionExpired');
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, [searchParams]);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="bg-zinc-900 border-zinc-800">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <Timer className="h-6 w-6 " />
            <AlertDialogTitle>{t('title')}</AlertDialogTitle>
          </div>
          <AlertDialogDescription>{t('description')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button onClick={() => setIsOpen(false)} className="w-full">
            {t('loginButton')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
