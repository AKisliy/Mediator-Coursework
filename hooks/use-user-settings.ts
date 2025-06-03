'use client';

import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';

import { getUserSettings, saveUserSettings } from '@/app/actions/data/user';
import { toast } from '@/hooks/use-toast';
import { DEFAULT_SETTINGS, localSettings } from '@/lib/storage/user-settings';
import { UserSettings } from '@/schemas';

export function useUserSettings() {
  const { data: session } = useSession();
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);

      const localSettingsData = localSettings.get();
      setSettings(localSettingsData);

      if (session?.user?.id) {
        try {
          const serverSettings = await getUserSettings();
          setSettings(serverSettings || DEFAULT_SETTINGS);
        } catch (error) {
          console.error('Failed to sync settings from server:', error);
        }
      }

      setIsLoading(false);
    };

    loadSettings();
  }, [session?.user?.id]);

  const updateSettings = useCallback(
    async (newSettings: Partial<UserSettings>) => {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);

      localSettings.set(updatedSettings);
      setIsSyncing(true);
      try {
        await saveUserSettings(updatedSettings);
      } catch (error) {
        console.error('Failed to sync settings to server:', error);
        toast({
          title: 'Ошибка синхронизации',
          description:
            'Настройки сохранены локально, но не синхронизированы с сервером',
          variant: 'destructive'
        });
      } finally {
        setIsSyncing(false);
      }
    },
    [settings, session?.user?.id]
  );

  const resetSettings = useCallback(async () => {
    await updateSettings(DEFAULT_SETTINGS);
  }, [updateSettings]);

  return {
    settings,
    updateSettings,
    resetSettings,
    isLoading,
    isSyncing
  };
}
