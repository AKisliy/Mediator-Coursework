'use client';

import { CheckCircle } from 'lucide-react';
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

export default function AccountDeletedDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const t = useTranslations('auth.accountDeleted');

  useEffect(() => {
    const accountDeleted = searchParams.get('accountDeleted');

    if (accountDeleted === 'true') {
      setIsOpen(true);
      if (accountDeleted) {
        const url = new URL(window.location.href);
        url.searchParams.delete('accountDeleted');
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, [searchParams]);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="bg-zinc-900 border-zinc-800">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <AlertDialogTitle className="text-green-500">
              {t('title')}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription>{t('description')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button onClick={() => setIsOpen(false)} className="w-full">
            {t('okButton')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
