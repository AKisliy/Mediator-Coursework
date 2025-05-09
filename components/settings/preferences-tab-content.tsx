'use client';

import { Computer, Globe, Moon, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useCookieSettings } from '@/hooks/use-cookie-settings';

import { LocaleLoadingOverlay } from '../locale-loading-overlay';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { TabsContent } from '../ui/tabs';

export default function PreferencesTabContent() {
  const { changeLocale, isPending, locale, theme, changeTheme } =
    useCookieSettings();
  const t = useTranslations('settings.preferenceTab');

  return (
    <>
      <TabsContent value="preferences" className="space-y-4">
        <RadioGroup
          onValueChange={e => changeTheme(e)}
          value={theme}
          className="grid grid-cols-3 gap-2"
        >
          <div
            className={`flex flex-col items-center gap-2 p-2 border rounded-md ${
              theme === 'light' ? 'border-primary' : ''
            }`}
          >
            <RadioGroupItem value="light" id="light" className="sr-only" />
            <Label
              htmlFor="light"
              className="cursor-pointer flex flex-col items-center"
            >
              <Sun className="h-6 w-6 mb-1" />
              <span>{t('themeLight')}</span>
            </Label>
          </div>
          <div
            className={`flex flex-col items-center gap-2 p-2 border rounded-md ${
              theme === 'dark' ? 'border-primary' : ''
            }`}
          >
            <RadioGroupItem value="dark" id="dark" className="sr-only" />
            <Label
              htmlFor="dark"
              className="cursor-pointer flex flex-col items-center"
            >
              <Moon className="h-6 w-6 mb-1" />
              <span>{t('themeDark')}</span>
            </Label>
          </div>
          <div
            className={`flex flex-col items-center gap-2 p-2 border rounded-md ${
              theme === 'system' ? 'border-primary' : ''
            }`}
          >
            <RadioGroupItem value="system" id="system" className="sr-only" />
            <Label
              htmlFor="system"
              className="cursor-pointer flex flex-col items-center"
            >
              <Computer className="h-6 w-6 mb-1" />
              <span>{t('themeSystem')}</span>
            </Label>
          </div>
        </RadioGroup>

        <RadioGroup
          onValueChange={changeLocale}
          value={locale}
          className="grid grid-cols-2 gap-2"
        >
          <div
            className={`flex items-center gap-2 p-2 border rounded-md ${
              locale === 'ru' ? 'border-primary' : ''
            }`}
          >
            <RadioGroupItem value="ru" id="ru" className="sr-only" />
            <Label
              htmlFor="ru"
              className="cursor-pointer flex items-center gap-2 w-full"
            >
              <Globe className="h-5 w-5" />
              <span>{t('languageRussian')}</span>
            </Label>
          </div>
          <div
            className={`flex items-center gap-2 p-2 border rounded-md ${
              locale === 'en' ? 'border-primary' : ''
            }`}
          >
            <RadioGroupItem value="en" id="en" className="sr-only" />
            <Label
              htmlFor="en"
              className="cursor-pointer flex items-center gap-2 w-full"
            >
              <Globe className="h-5 w-5" />
              <span>{t('languageEnglish')}</span>
            </Label>
          </div>
        </RadioGroup>
      </TabsContent>
      <LocaleLoadingOverlay isVisible={isPending} />
    </>
  );
}
