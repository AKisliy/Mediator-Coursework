'use client';

import { authenticate, resetPassword } from '@/app/actions/auth.action';
import { toast } from '@/hooks/use-toast';
import { ResetSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
  const [state, formAction] = useFormState(authenticate, null);
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
      console.log(res);

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
        title={'Забыли пароль?'}
        description={'Не переживайте, мы поможем 👨‍💻'}
        className="mb-4"
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
                            Ваш Email
                            <TooltipTrigger asChild>
                              <Button variant="link" className="p-1">
                                <QuestionMarkCircledIcon />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Введите email, указанный при регистрации</p>
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
                  'Получить ссылку для восстановления'
                ) : (
                  <div className="flex flex-row gap-2">
                    Момент... <Loader2 className="animate-spin" />
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
