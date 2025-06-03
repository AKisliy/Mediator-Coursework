import { getLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';

import { getUserLastSearch } from '@/app/actions/data/history';
import { formatTimestampToNow } from '@/lib/utils';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default async function UserLastSearch() {
  const t = await getTranslations('profile');
  const locale = await getLocale();
  const lastSearch = await getUserLastSearch();
  const hasLastSearch = !!lastSearch;

  return (
    <Link href={hasLastSearch ? `/history/${lastSearch.id}` : '/'}>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-gray-400">
            {t('lastSearch')}
          </CardTitle>
        </CardHeader>
        {hasLastSearch && (
          <CardContent>
            <p className="text-sm">{lastSearch.query}</p>
            <p className="text-xs text-gray-400 mt-2">
              {formatTimestampToNow(lastSearch.createdAt, locale)}
            </p>
          </CardContent>
        )}
        {!hasLastSearch && <CardContent>{t('noSearches')}</CardContent>}
      </Card>
    </Link>
  );
}
