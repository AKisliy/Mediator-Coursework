'use client';

import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';

import { updateUserProfileInformation } from '@/app/actions/data/user';
import { toast } from '@/hooks/use-toast';
import { DEFAULT_AVATAR_FILENAME } from '@/lib/constants';
import { deleteAvatar, uploadAvatar } from '@/lib/db/supabase';
import type { ProfileSettingsSchemaValues } from '@/schemas';

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
  const t = useTranslations('settings.profileTab');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(
    session?.user.image
  );

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isDirty }
  } = form;

  const onSubmit = async (data: ProfileSettingsSchemaValues) => {
    if (!session || !session.user) throw Error(t('userNotLoggedIn'));

    if (form.formState.dirtyFields.previewImage) {
      const imageFile = form.getValues('previewImage');
      let newImageUrl: string | undefined = avatarUrl;
      console.log(imageFile?.name);

      if (imageFile?.name === DEFAULT_AVATAR_FILENAME) {
        await deleteAvatar(session.user.id);
      } else {
        newImageUrl = await uploadAvatar(
          session.user.id,
          form.getValues('previewImage')
        );
      }

      if (!newImageUrl) throw Error(t('failedToSavePhoto'));
      data.image = newImageUrl;
    }

    const updatedData = { name: data.name, image: data.image };

    try {
      await updateUserProfileInformation(session?.user?.id ?? '', updatedData);
      toast({
        title: t('successTitle'),
        description: t('successDescription')
      });
      form.reset(data);
      await update({ image: updatedData.image, name: updatedData.name });
    } catch (e: any) {
      toast({
        title: t('errorTitle'),
        description: t('errorDescription'),
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
                <FormLabel htmlFor="name">{t('name')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <Label>{t('profilePhoto')}</Label>
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
