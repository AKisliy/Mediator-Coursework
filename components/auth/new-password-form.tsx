'use client';

import { authenticate, setNewPassword } from '@/app/actions/auth.action';
import { toast } from '@/hooks/use-toast';
import { NewPasswordSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form } from '../ui/form';
import CardWrapper from './card-wrapper';
import PasswordField from './fields/password-field';
import PrivacyPolicy from './privacy-policy';
import SubmitButton from './submit-button';

export function NewPasswordForm() {
  const [state, formAction] = useFormState(authenticate, null);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

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
          title: 'Ошибка ☠️',
          description: res.error,
          variant: 'destructive'
        });
      } else if (res?.success) {
        console.log('Got success');
        toast({
          title: 'Успех!✨',
          description: 'Ссылка отправлена на вашу почту'
        });
      }
    } catch (error) {
      console.error('Ошибка при сбросе пароля:', error);
      toast({
        title: 'Ошибка ☠️',
        description: 'Произошла непредвиденная ошибка',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CardWrapper
        title={'Смена пароля'}
        description={'Укажите новый пароль вашего аккаунта'}
        className="mb-4"
      >
        <Form {...form}>
          <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <PasswordField form={form} />
              <SubmitButton
                buttonText="Изменить пароль"
                isLoading={isLoading}
              />
            </div>
          </form>
        </Form>
      </CardWrapper>
      <PrivacyPolicy />
    </>
  );
}
