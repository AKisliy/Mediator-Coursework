'use client';

import { useLocale } from 'next-intl';
import { useTheme } from 'next-themes';
import { useTransition } from 'react';

import { Locale } from '@/i18n/config';
import { setUserLocale } from '@/lib/locale';

import { useUserSettings } from './use-user-settings';

export function useCookieSettings() {
  const { updateSettings } = useUserSettings();
  const [isPending, startTransition] = useTransition();
  const { theme, setTheme } = useTheme();
  const locale = useLocale();

  const changeLocale = async (locale: 'ru' | 'en') => {
    updateSettings({ language: locale });
    const newLocale = locale as Locale;
    startTransition(() => {
      setUserLocale(newLocale);
    });
  };

  const changeTheme = async (theme: string) => {
    const validTheme = theme as 'light' | 'dark' | 'system';
    updateSettings({ theme: validTheme });

    setTheme(validTheme);
  };

  return {
    changeLocale,
    isPending,
    changeTheme,
    theme,
    locale
  };
}
