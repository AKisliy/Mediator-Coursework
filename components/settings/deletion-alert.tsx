import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { checkPassword } from '@/app/actions/auth.action';
import { deleteAccount } from '@/app/actions/data/user';
import { DeleteAccountSchemaValues, deleteAccountSchema } from '@/schemas';

import PasswordField from '../auth/fields/password-field';
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
import { Form } from '../ui/form';

export default function DeletionAlert() {
  const { data: session } = useSession();
  const t = useTranslations('settings.deleteAccount');
  const commonT = useTranslations('common');
  const alertT = useTranslations('settings.deleteAccount.alert');
  const deleteAccountForm = useForm<DeleteAccountSchemaValues>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      password: ''
    }
  });
  const [isPending, startTransition] = useTransition();

  const onDeleteAccount = async (data: DeleteAccountSchemaValues) => {
    startTransition(async () => {
      const isCorrectPassword = await checkPassword(data.password);
      if (!isCorrectPassword) {
        deleteAccountForm.setError('password', {
          type: 'manual',
          message: t('errors.incorrectPassword')
        });
        return;
      }
      const id = session?.user?.id;
      if (!id) {
        deleteAccountForm.setError('password', {
          type: 'manual',
          message: t('errors.noUserId')
        });
        return;
      }
      await signOut({ redirectTo: '/auth/login?accountDeleted=true' });
      await deleteAccount(id);
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full mt-4">
          <Trash2 className="h-4 w-4 mr-2" />
          {t('button')}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-zinc-900 border-zinc-800">
        <Form {...deleteAccountForm}>
          <form onSubmit={deleteAccountForm.handleSubmit(onDeleteAccount)}>
            <AlertDialogHeader className="mb-6">
              <AlertDialogTitle>{alertT('title')}</AlertDialogTitle>
              <AlertDialogDescription>
                {alertT('description')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <PasswordField form={deleteAccountForm} />

            <AlertDialogFooter className="mt-6">
              <AlertDialogCancel
                className="bg-zinc-800 hover:bg-zinc-700"
                type="button"
              >
                {alertT('cancelButton')}
              </AlertDialogCancel>
              <Button type="submit" variant="destructive" disabled={isPending}>
                {isPending ? (
                  <span className="animate-pulse">{commonT('loading')}</span>
                ) : (
                  <span>{alertT('deleteButton')}</span>
                )}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
