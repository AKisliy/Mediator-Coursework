'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { login } from '@/app/actions/auth.action';
import { toast } from '@/hooks/use-toast';
import { LoginSchema } from '@/schemas';

import { Form } from '../ui/form';
import CardWrapper from './card-wrapper';
import EmailLoginForm from './email-login-form';
import ProvidersSection from './providers-section';

export function LoginForm() {
  const t = useTranslations('auth.login');
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    setIsLoading(true);
    login(data).then(res => {
      if (res && res.error) {
        toast({
          title: t('toast.error.title'),
          description: res.error,
          variant: 'destructive'
        });
        setIsLoading(false);
      }
      if (res && res.success) {
        toast({
          title: t('toast.success.title'),
          description: t('toast.success.description')
        });
        setIsLoading(false);
      }
    });
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
              <EmailLoginForm form={form} loading={isLoading} />
              <ProvidersSection />
              <div className="text-center text-sm">
                {t('noAccount')}{' '}
                <a href="/auth/signup" className="underline underline-offset-4">
                  {t('createAccount')}
                </a>
              </div>
            </div>
          </form>
        </Form>
      </CardWrapper>

      {/* <PrivacyPolicy /> */}
    </>
  );
}
