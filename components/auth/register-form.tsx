'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { register } from '@/app/actions/auth.action';
import { toast } from '@/hooks/use-toast';
import { RegisterSchema } from '@/schemas';

import { Form } from '../ui/form';
import CardWrapper from './card-wrapper';
import EmailRegistrationForm from './email-registration-form';
import ProvidersSection from './providers-section';

export default function RegisterForm() {
  const t = useTranslations('auth.register');
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      name: '',
      password: '',
      passwordConfirmation: ''
    }
  });

  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    setLoading(true);
    register(data).then(res => {
      if (res.error) {
        toast({
          title: t('toast.error.title'),
          description: res.error,
          variant: 'destructive'
        });
        setLoading(false);
      }
      if (res.success) {
        toast({
          title: t('toast.success.title'),
          description: t('toast.success.description')
        });
        setLoading(false);
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
              <EmailRegistrationForm form={form} isLoading={loading} />
              <ProvidersSection />
              <div className="text-center text-sm">
                {t('haveAccount')}{' '}
                <a href="/auth/login" className="underline underline-offset-4">
                  {t('login')}
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
