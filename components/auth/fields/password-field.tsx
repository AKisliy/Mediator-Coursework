'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface PasswordFieldProps {
  form: UseFormReturn<any>;
  includeForgotPassword?: boolean;
  passwordFieldName?: string;
  translationsPath?: string;
}

export default function PasswordField({
  form,
  includeForgotPassword,
  passwordFieldName = 'password',
  translationsPath = 'auth.passwordField'
}: PasswordFieldProps) {
  const t = useTranslations(translationsPath);
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(prevState => !prevState);
  return (
    <FormField
      control={form.control}
      name={passwordFieldName}
      render={({ field }) => (
        <FormItem className="relative">
          <div className="flex items-center">
            <FormLabel>{t(passwordFieldName)}</FormLabel>
            {includeForgotPassword && (
              <Link
                href="/auth/reset-password"
                className="ml-auto text-sm text-gray-500 underline-offset-2 hover:underline"
              >
                {t('forgot')}
              </Link>
            )}
          </div>
          <FormControl>
            <div className="relative">
              <Input
                {...field}
                placeholder="******"
                type={isVisible ? 'text' : 'password'}
              />
              <Button
                className="absolute inset-y-0 end-0 z-20"
                type="button"
                onClick={toggleVisibility}
                aria-label={isVisible ? t('hide') : t('show')}
                aria-pressed={isVisible}
                aria-controls={passwordFieldName}
                variant="link"
              >
                {isVisible ? (
                  <EyeOff size={20} aria-hidden="true" />
                ) : (
                  <Eye size={20} aria-hidden="true" />
                )}
              </Button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
