'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { updateUserProfileInformation } from '@/app/actions/data/user';
import { toast } from '@/hooks/use-toast';
import { DEFAULT_AVATAR_FILENAME } from '@/lib/constants';
import { deleteAvatar, uploadAvatar } from '@/lib/db/supabase';
import { ProfileSettingsSchemaValues } from '@/schemas';

import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { TabsContent } from '../ui/tabs';
import AvatarComponent from './avatar';
import FormSubmitButton from './form-submit-button';

export default function ProfileTabContent({
  form
}: {
  form: UseFormReturn<ProfileSettingsSchemaValues>;
}) {
  const { data: session, update } = useSession();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(
    session?.user.image
  );

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isDirty }
  } = form;

  const onSubmit = async (data: ProfileSettingsSchemaValues) => {
    if (!session || !session.user)
      throw Error('Пользователь не вошел в систему');
    if (form.formState.dirtyFields.previewImage) {
      const imageFile = form.getValues('previewImage');
      let newImageUrl: string | undefined = avatarUrl;
      console.log(imageFile?.name);
      if (imageFile?.name === DEFAULT_AVATAR_FILENAME) {
        await deleteAvatar(session.user.id);
      } else
        newImageUrl = await uploadAvatar(
          session.user.id,
          form.getValues('previewImage')
        );
      if (!newImageUrl) throw Error('Не удалось сохранить фото в БД');
      data.image = newImageUrl;
    }
    const updatedData = { name: data.name, image: data.image };
    try {
      await updateUserProfileInformation(session?.user?.id ?? '', updatedData);
      toast({
        title: 'Готово ✅',
        description: 'Изменения успешно сохранены'
      });
      form.reset(data);
      await update({ image: updatedData.image, name: updatedData.name });
    } catch (e: any) {
      toast({
        title: 'Ошибка ⛔️',
        description:
          'Во время сохранения произошла неизвестная ошибка. Повторите попытку позже',
        variant: 'destructive'
      });
    }
  };

  return (
    <TabsContent value="profile" className="space-y-4">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="name">Имя</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-zinc-800 border-zinc-700" />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <Label>Фотография профиля</Label>
            <AvatarComponent
              username={session?.user.username}
              avatarUrl={avatarUrl}
              setAvatarUrl={setAvatarUrl}
              url={session?.user.image}
              fallback={session?.user.name}
              onPreviewUpload={(file: File) => {
                form.setValue('previewImage', file, {
                  shouldDirty: true,
                  shouldValidate: true
                });
              }}
            />
          </div>
          <FormSubmitButton isDirty={isDirty} isLoading={isSubmitting} />
        </form>
      </Form>
    </TabsContent>
  );
}
