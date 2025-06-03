import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { getUserLocale } from '@/lib/locale';

import { Locale, locales } from './config';

export default getRequestConfig(async () => {
  const locale = await getUserLocale();

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
