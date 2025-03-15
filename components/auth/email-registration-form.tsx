'use client';

import { RegisterSchema } from '@/schemas';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
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
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Имя</FormLabel>
            <FormControl>
              <Input {...field} placeholder="John Doe" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <PasswordField form={form} includeForgotPassword={false} />
      <PasswordField
        form={form}
        includeForgotPassword={false}
        passwordFieldName="passwordConfirmation"
      />
      <SubmitButton buttonText="Зарегистрироваться" isLoading={isLoading} />
    </>
  );
}
