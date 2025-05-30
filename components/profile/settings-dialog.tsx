'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMediaQuery } from '@/hooks/use-media-query';
import {
  PreferencesFormSchemaValues,
  ProfileSettingsSchemaValues,
  preferencesFormSchema,
  profileSettingsSchema
} from '@/schemas';

import PreferencesTabContent from '../settings/preferences-tab-content';
import ProfileTabContent from '../settings/profile-tab-content';
import SecurityTabContent from '../settings/security-tab-content';
import UnsavedAlertDialog from '../settings/unsaved-alert';
import { Button } from '../ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '../ui/drawer';

interface SettingsDialogProps {
  onClose: () => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (b: boolean) => void;
}

export default function SettingsDialog({
  onClose,
  setIsSettingsOpen,
  isSettingsOpen
}: SettingsDialogProps) {
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);

  const { data: session } = useSession();

  const profileForm = useForm<ProfileSettingsSchemaValues>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      name: session?.user.name,
      image: session?.user.image
    }
  });

  const preferencesForm = useForm<PreferencesFormSchemaValues>({
    resolver: zodResolver(preferencesFormSchema)
    // defaultValues: {
    //   theme: user?.theme,
    //   language: user?.language
    // }
  });

  const handleOpenChange: (o: boolean) => void = (open: boolean) => {
    if (!open && profileForm.formState.isDirty) {
      setShowUnsavedWarning(true);
    } else {
      profileForm.reset(
        {
          name: session?.user.name,
          image: session?.user.image
        },
        { keepDefaultValues: false, keepDirty: false }
      );
      setIsSettingsOpen(open);
    }
  };

  const onAlertAction = () => {
    setShowUnsavedWarning(false);
    onClose();
    profileForm.reset(
      {
        name: session?.user.name,
        image: session?.user.image
      },
      { keepDefaultValues: false, keepDirty: false }
    );
  };

  const isDesktop = useMediaQuery('(min-width: 768px)');
  if (isDesktop)
    return (
      <>
        <Dialog open={isSettingsOpen} onOpenChange={handleOpenChange}>
          <DialogContent className="bg-zinc-900 border-zinc-800 max-w-md">
            <DialogHeader>
              <DialogTitle>Настройки</DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="profile" className="mt-4">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="profile">Профиль</TabsTrigger>
                <TabsTrigger value="security">Безопасность</TabsTrigger>
                <TabsTrigger value="preferences">Предпочтения</TabsTrigger>
              </TabsList>
              <ProfileTabContent form={profileForm} />
              <PreferencesTabContent form={preferencesForm} />
              <SecurityTabContent />
            </Tabs>
          </DialogContent>
        </Dialog>

        <UnsavedAlertDialog
          onAction={onAlertAction}
          showUnsavedWarning={showUnsavedWarning}
          setShowUnsavedWarning={setShowUnsavedWarning}
        />
      </>
    );

  return (
    <Drawer open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you@apos;re done.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
