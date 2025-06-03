'use client';

import { UserSearch } from '@prisma/client';
import { Clock } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { formatTimestampToNow } from '@/lib/utils';

import { useHistorySearch } from './history-page-client';
import LoadMoreButton from './load-more-button';

interface HistoryEntriesProps {
  initialEntries: UserSearch[];
}

export default function HistoryEntries({
  initialEntries
}: HistoryEntriesProps) {
  const locale = useLocale();
  const t = useTranslations('history');
  const [entries, setEntries] = useState<UserSearch[]>(initialEntries);

  const { searchQuery } = useHistorySearch();

  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) {
      return entries;
    }
    return entries.filter(entry =>
      entry.query.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [entries, searchQuery]);

  return (
    <div className="space-y-4">
      {filteredEntries.length === 0 && searchQuery.trim() ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>{t('noQueriesFound')}</p>
          <p className="text-sm">{t('noQueriesFoundDescription')}</p>
        </div>
      ) : (
        <>
          {filteredEntries.map(entry => (
            <Link
              key={entry.id}
              href={`/history/${entry.id}`}
              className="block p-4 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">
                    {searchQuery.trim() ? (
                      <HighlightedText
                        text={entry.query}
                        highlight={searchQuery}
                      />
                    ) : (
                      entry.query
                    )}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                    <Clock className="h-3 w-3" />
                    {formatTimestampToNow(entry.createdAt, locale)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {!searchQuery.trim() && (
            <LoadMoreButton
              initialCount={entries?.length ?? 0}
              onLoadMore={newEntries =>
                setEntries(prev => [...prev, ...newEntries])
              }
            />
          )}
        </>
      )}
    </div>
  );
}

function HighlightedText({
  text,
  highlight
}: {
  text: string;
  highlight: string;
}) {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }

  const regex = new RegExp(
    `(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
    'gi'
  );
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark
            key={index}
            className="bg-yellow-200 dark:bg-yellow-800 rounded px-1"
          >
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
}
