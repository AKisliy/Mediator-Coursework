import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { PasswordFormSchemaValues, passwordFormSchema } from '@/schemas';

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
import { TabsContent } from '../ui/tabs';
import DeletionAlert from './deletion-alert';

export default function SecurityTabContent() {
  const passwordForm = useForm<PasswordFormSchemaValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });
  const onPasswordSubmit = (data: PasswordFormSchemaValues) => {
    console.log('Submitted data:');
    console.log(data);
  };
  // TODO: change password field to existing components
  return (
    <TabsContent value="security" className="space-y-4">
      <Form {...passwordForm}>
        <form
          onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
          className="space-y-4"
        >
          <FormField
            control={passwordForm.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Текущий пароль</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    className="bg-zinc-800 border-zinc-700"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={passwordForm.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Новый пароль</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    className="bg-zinc-800 border-zinc-700"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={passwordForm.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Подтвердите пароль</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    className="bg-zinc-800 border-zinc-700"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={!passwordForm.formState.isDirty}
          >
            Обновить пароль
          </Button>
        </form>
      </Form>

      <DeletionAlert />
    </TabsContent>
  );
}
