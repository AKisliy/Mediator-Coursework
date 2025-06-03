'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
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
  type ProfileSettingsSchemaValues,
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
  const t = useTranslations('settings.dialog');

  const { data: session } = useSession();

  const profileForm = useForm<ProfileSettingsSchemaValues>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      name: session?.user.name,
      image: session?.user.image
    }
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
          <DialogContent className="bg-card border-card max-w-md">
            <DialogHeader>
              <DialogTitle>{t('title')}</DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="profile" className="mt-4">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="profile">{t('profileTab')}</TabsTrigger>
                <TabsTrigger value="security">{t('securityTab')}</TabsTrigger>
                <TabsTrigger value="preferences">
                  {t('preferencesTab')}
                </TabsTrigger>
              </TabsList>
              <ProfileTabContent form={profileForm} />
              <PreferencesTabContent />
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
    <>
      <Drawer open={isSettingsOpen} onOpenChange={handleOpenChange}>
        <DrawerContent className="max-h-[90vh] overflow-y-auto">
          <DrawerHeader className="text-left">
            <DrawerTitle>{t('title')}</DrawerTitle>
          </DrawerHeader>

          <div className="px-4 pb-4">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4 w-full">
                <TabsTrigger value="profile" className="text-xs">
                  {t('profileTab')}
                </TabsTrigger>
                <TabsTrigger value="security" className="text-xs">
                  {t('securityTab')}
                </TabsTrigger>
                <TabsTrigger value="preferences" className="text-xs">
                  {t('preferencesTab')}
                </TabsTrigger>
              </TabsList>
              <ProfileTabContent form={profileForm} />
              <PreferencesTabContent />
              <SecurityTabContent />
            </Tabs>
          </div>

          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">{t('cancel')}</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <UnsavedAlertDialog
        onAction={onAlertAction}
        showUnsavedWarning={showUnsavedWarning}
        setShowUnsavedWarning={setShowUnsavedWarning}
      />
    </>
  );
}
