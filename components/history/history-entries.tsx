import { getUserHistory } from '@/app/actions/search-history';
import { formatTimestamp } from '@/lib/utils';
import { Clock } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '../ui/skeleton';

export default async function HistoryEntries() {
  const searchHistory = await getUserHistory();
  return (
    <div className="grid gap-4">
      {searchHistory?.map(entry => (
        <Link
          key={entry.id}
          href={`/history/${entry.id}`}
          className="block p-4 rounded-lg hover:bg-muted/50 transition-colors"
        >
          <div className="grid gap-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{entry.query}</h3>
              <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                <Clock className="h-3 w-3" />
                {formatTimestamp(entry.createdAt)}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function HistoryEntriesFallback() {
  return (
    <div className="grid gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton className="h-12 rounded-xl" key={i} />
      ))}
    </div>
  );
}
