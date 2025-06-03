import { useTranslations } from 'next-intl';

import { TelegramBlogger } from '@/types/blogger';

import MetricCardField from './metric-card-field';

export function TelegramBloggerCardContent({
  blogger
}: {
  blogger: TelegramBlogger;
}) {
  const t = useTranslations('bloggers');
  return (
    <div className="space-y-4">
      <p className="text-lg">
        <strong>{blogger?.channel_title?.toLocaleString() ?? ''}</strong>
      </p>

      <p className="text-base">
        {blogger?.description?.toLocaleString() ?? t('noDescriptionFallback')}
      </p>
      <hr />
      <p className="text-sm">
        <strong>{t('subscribers')}</strong>
        {': '}
        {blogger?.followers_count?.toLocaleString() ?? t('unknownAmount')}
      </p>
      {Object.entries(blogger.statistics)
        .filter(([_, value]) => typeof value === 'object' && value.value)
        .map(([key, value]) => (
          <MetricCardField metric={value} key={key} />
        ))}
    </div>
  );
}
