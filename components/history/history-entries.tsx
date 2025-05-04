'use client';

import { formatTimestampToNow } from '@/lib/utils';
import { UserSearch } from '@prisma/client';
import { Clock } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import LoadMoreButton from './load-more-button';

interface HistoryEntriesProps {
  initialEntries: UserSearch[];
}

export default function HistoryEntries({
  initialEntries
}: HistoryEntriesProps) {
  const [entries, setEntries] = useState<UserSearch[]>(initialEntries);

  return (
    <div className="space-y-4">
      {entries?.map(entry => (
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
                {formatTimestampToNow(entry.createdAt)}
              </div>
            </div>
          </div>
        </Link>
      ))}
      <LoadMoreButton
        initialCount={entries?.length ?? 0}
        onLoadMore={newEntries => setEntries(prev => [...prev, ...newEntries])}
      />
    </div>
  );
}
