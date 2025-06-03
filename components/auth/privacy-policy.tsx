'use client';

import { useTranslations } from 'next-intl';

export default function PrivacyPolicy() {
  const t = useTranslations('common.privacyPolicy');

  return (
    <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
      {t.rich('agreement', {
        termsLink: _ => <a href="#">{t('common.privacyPolicy.termsLink')}</a>,
        privacyLink: chunks => <a href="#">{chunks}</a>
      })}
    </div>
  );
}
