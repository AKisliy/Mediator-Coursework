import { getUserLastSearch } from '@/data/history';
import { formatTimestampToNow } from '@/lib/utils';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default async function UserLastSearch() {
  const lastSearch = await getUserLastSearch();
  const hasLastSearch = !!lastSearch;
  return (
    <Link href={hasLastSearch ? `/history/${lastSearch.id}` : '/'}>
      <Card className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 transition-colors">
        <CardHeader>
          <CardTitle className="text-sm text-gray-400">
            Последний запрос
          </CardTitle>
        </CardHeader>
        {hasLastSearch && (
          <CardContent>
            <p className="text-sm">{lastSearch.query}</p>
            <p className="text-xs text-gray-400 mt-2">
              {formatTimestampToNow(lastSearch.createdAt)}
            </p>
          </CardContent>
        )}
        {!hasLastSearch && (
          <CardContent>{'Пока вы не делали запросов...'}</CardContent>
        )}
      </Card>
    </Link>
  );
}
