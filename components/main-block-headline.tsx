'use client';

import { useTranslations } from 'next-intl';

export default function MainBlockHeadline() {
  const t = useTranslations('search');
  return (
    <>
      <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">
        {t('title')}
      </h1>
      <p className="text-sm md:text-base text-center mb-8 text-muted-foreground">
        {t('suptitle')}
      </p>
    </>
  );
}
