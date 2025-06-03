'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { setNewPassword } from '@/app/actions/auth.action';
import { toast } from '@/hooks/use-toast';
import { NewPasswordSchema } from '@/schemas';

import { Form } from '../ui/form';
import CardWrapper from './card-wrapper';
import PasswordField from './fields/password-field';
import PrivacyPolicy from './privacy-policy';
import SubmitButton from './submit-button';

export function NewPasswordForm() {
  const t = useTranslations('auth.newPassword');
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: ''
    }
  });

  const onSubmit = async (data: z.infer<typeof NewPasswordSchema>) => {
    setIsLoading(true);

    try {
      const res = await setNewPassword(data, token);

      if (res?.error) {
        toast({
          title: t('toast.error.title'),
          description: res.error,
          variant: 'destructive'
        });
      } else if (res?.success) {
        toast({
          title: t('toast.success.title'),
          description: t('toast.success.description')
        });
        router.push('/auth/login');
      }
    } catch {
      toast({
        title: t('toast.error.title'),
        description: t('toast.error.unexpected'),
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CardWrapper
        title={t('title')}
        description={t('description')}
        className="mb-4"
      >
        <Form {...form}>
          <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <PasswordField form={form} />
              <SubmitButton
                buttonText={t('submitButton')}
                isLoading={isLoading}
                isDisabled={isLoading}
              />
            </div>
          </form>
        </Form>
      </CardWrapper>
      <PrivacyPolicy />
    </>
  );
}
