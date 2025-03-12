'use client';

import { proceedVerification } from '@/app/actions/auth.action';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import BeatLoader from 'react-spinners/BeatLoader';
import CardWrapper from './card-wrapper';
import { FormError } from './form-error';
import { FormSuccess } from './form-success';

const VerifyEmailForm = () => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const onSubmit = useCallback(() => {
    if (success || error) {
      return;
    }

    if (!token) {
      setError('No token provided');
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
      .catch(err => {
        console.error(err);
        setError('An unexpected error occurred');
      });
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      title="Потверждение вашего email"
      description="Сейчас мы подтверждаем адрес вашей почты.."
    >
      <div className="flex min-h-64 items-center w-full justify-center">
        {!success && !error && <BeatLoader color="white" />}
        <FormSuccess message={success} />
        {!success && <FormError message={error} />}
      </div>
    </CardWrapper>
  );
};

export default VerifyEmailForm;
