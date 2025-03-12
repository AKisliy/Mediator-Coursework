'use client';

import { RegisterSchema } from '@/schemas';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form';
import { Input } from '../ui/input';

export default function EmailRegistrationForm({
  form,
  loading
}: {
  form: UseFormReturn<z.infer<typeof RegisterSchema>>;
  loading: boolean;
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
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Пароль</FormLabel>
            <FormControl>
              <Input {...field} placeholder="******" type="password" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="passwordConfirmation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Подтверждение пароля</FormLabel>
            <FormControl>
              <Input {...field} placeholder="******" type="password" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit" className="w-full" aria-disabled={loading}>
        Login
      </Button>
    </>
  );
}
