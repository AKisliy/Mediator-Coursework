import { TelegramBlogger } from '@/types/blogger';

export function TelegramBloggerCardContent({
  blogger
}: {
  blogger: TelegramBlogger;
}) {
  return (
    <div className="space-y-4">
      <p className="text-lg">
        <strong>{blogger?.channel_title?.toLocaleString() ?? ''}</strong>
      </p>

      <p className="text-base">
        {blogger?.description?.toLocaleString() ?? 'Нет описания'}
      </p>
      <hr />
      <p className="text-sm">
        <strong>Подписчиков:</strong>{' '}
        {blogger?.followers_count?.toLocaleString() ?? 'Неизвестно'}
      </p>
      {/* {Object.entries(blogger.statistics)
        .filter(([_, value]) => typeof value === 'object' && value.value)
        .map(([key, value]) => (
          <MetricCardField metric={value} key={key} />
        ))} */}
    </div>
  );
}
