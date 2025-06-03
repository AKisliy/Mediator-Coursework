'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import BeatLoader from 'react-spinners/BeatLoader';

import { proceedVerification } from '@/app/actions/auth.action';

import { Button } from '../ui/button';
import CardWrapper from './card-wrapper';
import { FormError } from './form-error';
import { FormSuccess } from './form-success';

const VerifyEmailForm = () => {
  const t = useTranslations('auth.verifyEmail');
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const { theme } = useTheme();

  const foregroundColor =
    theme === 'dark' || theme === 'system' ? '#ffffff' : '#000000';

  const onSubmit = useCallback(() => {
    if (success || error) {
      return;
    }

    if (!token) {
      setError(t('error.noToken'));
      return;
    }

    proceedVerification(token)
      .then(data => {
        if (data.success) {
          setSuccess(data.success);
        }
        if (data.error) {
          setError(data.error);
        }
      })
      .catch(_ => {
        setError(t('error.unexpected'));
      });
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      title={t('title')}
      description={t('description')}
      className="justify-center"
    >
      <div className="flex flex-col items-center">
        <div className="flex flex-col min-h-64 items-center w-full justify-center">
          {!success && !error && <BeatLoader color={foregroundColor} />}
          <FormSuccess message={success} />
          {!success && <FormError message={error} />}
        </div>
        <Button asChild disabled={!success && !error} className="self-center">
          <Link href="/auth/login">{t('loginButton')}</Link>
        </Button>
      </div>
    </CardWrapper>
  );
};

export default VerifyEmailForm;
