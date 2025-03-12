'use client';

import { authenticate, login } from '@/app/actions/auth.action';

import { toast } from '@/hooks/use-toast';
import { LoginSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form } from '../ui/form';
import CardWrapper from './card-wrapper';
import EmailLoginForm from './email-login-form';
import PrivacyPolicy from './privacy-policy';
import ProvidersSection from './providers-section';

export function LoginForm() {
  const [state, formAction] = useFormState(authenticate, null);
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
      if (res.error) {
        toast({
          title: 'Ошибка ☠️',
          description: res.error,
          variant: 'destructive'
        });
        setIsLoading(false);
      }
      if (res.success) {
        toast({
          title: 'Успех!',
          description: 'Ссылка с подтверждением отправлена на почту'
        });
        setIsLoading(false);
      }
    });
  };
  return (
    <>
      <CardWrapper
        title={'С возвращением'}
        description={'Войдите в свой аккаунт Mediator'}
        className="mb-4"
      >
        <Form {...form}>
          <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <EmailLoginForm form={form} loading={isLoading} />
              <ProvidersSection />
              <div className="text-center text-sm">
                Еще не аккаунта?{' '}
                <a href="/auth/signup" className="underline underline-offset-4">
                  Создать
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
