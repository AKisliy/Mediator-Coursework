'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { resetPassword } from '@/app/actions/auth.action';
import { toast } from '@/hooks/use-toast';
import { ResetSchema } from '@/schemas';

import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form';
import { Input } from '../ui/input';
import { Tooltip, TooltipContent } from '../ui/tooltip';
import CardWrapper from './card-wrapper';
import PrivacyPolicy from './privacy-policy';

export function ResetForm() {
  const t = useTranslations('auth.reset');
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (data: z.infer<typeof ResetSchema>) => {
    setIsLoading(true);

    try {
      const res = await resetPassword(data);

      if (res?.error) {
        toast({
          title: t('toast.error.title'),
          description: res.error,
          variant: 'destructive'
        });
      } else if (res?.success) {
        toast({
          title: t('toast.success.title'),
          description: t('toast.success.description')
        });
      }
    } catch {
      toast({
        title: t('toast.error.title'),
        description: t('toast.error.description'),
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CardWrapper
        title={t('title')}
        description={t('description')}
        className="mb-4"
        includeBackButton
      >
        <Form {...form}>
          <form className="p-4 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <TooltipProvider>
                    <FormItem>
                      <FormLabel>
                        <Tooltip>
                          <div className="flex flex-row items-center">
                            {t('email.label')}
                            <TooltipTrigger asChild>
                              <Button variant="link" className="p-1">
                                <QuestionMarkCircledIcon />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{t('email.tooltip')}</p>
                            </TooltipContent>
                          </div>
                        </Tooltip>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="ilove@mediator.ru"
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </TooltipProvider>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {!isLoading ? (
                  t('getLinkButton')
                ) : (
                  <div className="flex flex-row gap-2">
                    {t('loading')} <Loader2 className="animate-spin" />
                  </div>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardWrapper>

      <PrivacyPolicy />
    </>
  );
}
