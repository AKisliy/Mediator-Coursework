'use client';

import { toast } from '@/hooks/use-toast';
import { RegisterSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { register } from '@/app/actions/auth.action';
import { Form } from '../ui/form';
import CardWrapper from './card-wrapper';
import EmailRegistrationForm from './email-registration-form';
import PrivacyPolicy from './privacy-policy';
import ProvidersSection from './providers-section';

export default function RegisterForm() {
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
          title: 'Ошибка ☠️',
          description: res.error,
          variant: 'destructive'
        });
        setLoading(false);
      }
      if (res.success) {
        toast({
          title: 'Успех!',
          description: 'Ссылка с подтверждением отправлена на почту'
        });
        setLoading(false);
      }
    });
  };

  return (
    <>
      <CardWrapper
        title={'Добро пожаловать'}
        description={'Создайте свой аккаунт Mediator'}
        className="mb-4"
      >
        <Form {...form}>
          <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <EmailRegistrationForm form={form} loading={loading} />
              <ProvidersSection />
              <div className="text-center text-sm">
                Уже есть аккаунт?{' '}
                <a href="/auth/login" className="underline underline-offset-4">
                  Войти
                </a>
              </div>
            </div>
          </form>
        </Form>
      </CardWrapper>
      <PrivacyPolicy />
    </>
  );
}
