'use client';

import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

import { RegisterSchema } from '@/schemas';

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

export default function EmailRegistrationForm({
  form,
  isLoading
}: {
  form: UseFormReturn<z.infer<typeof RegisterSchema>>;
  isLoading: boolean;
}) {
  const t = useTranslations('auth.register');
  return (
    <>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('labels.email')}</FormLabel>
            <FormControl>
              <Input {...field} placeholder="ilove@mediator.ru" type="email" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('labels.name')}</FormLabel>
            <FormControl>
              <Input {...field} placeholder="John Doe" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <PasswordField form={form} />
      <PasswordField form={form} passwordFieldName="passwordConfirmation" />
      <SubmitButton
        buttonText={t('submitButton')}
        isLoading={isLoading}
        isDisabled={isLoading}
      />
    </>
  );
}
