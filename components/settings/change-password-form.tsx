'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import React, { useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { changePassword, checkPassword } from '@/app/actions/auth.action';
import { toast } from '@/hooks/use-toast';
import { PasswordFormSchemaValues, passwordFormSchema } from '@/schemas';

import PasswordField from '../auth/fields/password-field';
import { Button } from '../ui/button';
import { Form } from '../ui/form';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../ui/tooltip';

export default function ChangePasswordForm() {
  const t = useTranslations('settings.securityTab');
  const commonT = useTranslations('common');
  const passwordForm = useForm<PasswordFormSchemaValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });
  const [isPending, startTransition] = useTransition();
  const { update } = useSession();

  const onPasswordSubmit = (data: PasswordFormSchemaValues) => {
    startTransition(async () => {
      const isCorrectPassword = await checkPassword(data.currentPassword);
      if (!isCorrectPassword) {
        passwordForm.setError('currentPassword', {
          type: 'manual',
          message: commonT('error.incorrectPassword')
        });
        return;
      }
      try {
        const { newRefreshToken } = await changePassword(data.newPassword);
        toast({
          title: t('toast.success.title'),
          description: t('toast.success.description')
        });
        await update({ refreshToken: newRefreshToken });
        passwordForm.reset();
      } catch {
        toast({
          title: t('toast.error.title'),
          description: t('toast.error.description'),
          variant: 'destructive'
        });
      }
    });
  };
  return (
    <TooltipProvider>
      <Tooltip>
        <div className="flex flex-row items-center">
          <h2 className="text-lg font-semibold">{t('changePasswordTitle')}</h2>
          <TooltipTrigger asChild>
            <Button variant="link" className="p-1">
              <QuestionMarkCircledIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <p>{t('tooltip.description')}</p>
          </TooltipContent>
        </div>
      </Tooltip>
      <Form {...passwordForm}>
        <form
          onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
          className="space-y-4"
        >
          <PasswordField
            form={passwordForm}
            passwordFieldName="currentPassword"
            translationsPath="settings.securityTab"
          />
          <PasswordField
            form={passwordForm}
            passwordFieldName="newPassword"
            translationsPath="settings.securityTab"
          />
          <PasswordField
            form={passwordForm}
            passwordFieldName="confirmPassword"
            translationsPath="settings.securityTab"
          />

          <Button
            type="submit"
            className="w-full"
            disabled={!passwordForm.formState.isDirty || isPending}
          >
            {isPending ? (
              <span className="animate-pulse">
                {t('changingPasswordButton')}
              </span>
            ) : (
              t('changePasswordButton')
            )}
          </Button>
        </form>
      </Form>
    </TooltipProvider>
  );
}
