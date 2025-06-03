'use client';

import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

import { Button, ButtonProps } from '../ui/button';

interface SubmitButtonProps extends ButtonProps {
  isLoading: boolean;
  buttonText: string;
  loadingText?: string;
  className?: string;
  isDisabled: boolean;
}

export default function SubmitButton({
  isLoading,
  buttonText,
  loadingText,
  className,
  variant,
  isDisabled
}: SubmitButtonProps) {
  const t = useTranslations('common');
  return (
    <Button
      type="submit"
      className={cn('w-full', className)}
      disabled={isDisabled}
      variant={variant}
    >
      {!isLoading ? (
        buttonText
      ) : (
        <div className="flex flex-row gap-2">
          {loadingText ?? t('loading')} <Loader2 className="animate-spin" />
        </div>
      )}
    </Button>
  );
}
