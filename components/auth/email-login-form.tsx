'use client';

import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

import { LoginSchema } from '@/schemas';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form';
import { Input } from '../ui/input';
import PasswordField from './fields/password-field';
import SubmitButton from './submit-button';

export default function EmailLoginForm({
  form,
  loading
}: {
  form: UseFormReturn<z.infer<typeof LoginSchema>>;
  loading: boolean;
}) {
  const t = useTranslations('auth.login');
  return (
    <>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} placeholder="ilove@mediator.ru" type="email" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <PasswordField form={form} includeForgotPassword />
      <SubmitButton
        buttonText={t('submitButton')}
        isLoading={loading}
        isDisabled={loading}
      />
    </>
  );
}
