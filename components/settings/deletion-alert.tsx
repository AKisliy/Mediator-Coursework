import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { DeleteAccountSchema } from '@/schemas';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '../ui/alert-dialog';
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

export default function DeletionAlert() {
  const deleteAccountForm = useForm<z.infer<typeof DeleteAccountSchema>>({
    resolver: zodResolver(DeleteAccountSchema),
    defaultValues: {
      deleteAccountPassword: ''
    }
  });

  const onDeleteAccount = () => {
    console.log('Account was deleted');
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full mt-4">
          <Trash2 className="h-4 w-4 mr-2" />
          Удалить аккаунт
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-zinc-900 border-zinc-800">
        <Form {...deleteAccountForm}>
          <form onSubmit={deleteAccountForm.handleSubmit(onDeleteAccount)}>
            <AlertDialogHeader>
              <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
              <AlertDialogDescription>
                Это действие нельзя отменить. Ваш аккаунт и все связанные с ним
                данные будут удалены навсегда.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <FormField
              control={deleteAccountForm.control}
              name="deleteAccountPassword"
              render={({ field }) => (
                <FormItem className="my-4">
                  <FormLabel>Введите пароль для подтверждения</FormLabel>
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

            <AlertDialogFooter>
              <AlertDialogCancel className="bg-zinc-800 hover:bg-zinc-700">
                Отмена
              </AlertDialogCancel>
              <Button type="submit" variant="destructive">
                Удалить
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
