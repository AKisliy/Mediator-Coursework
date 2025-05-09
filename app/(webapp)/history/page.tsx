import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

import { HistoryEntriesFallback } from '@/components/history/fallback';
import { HistoryPageClient } from '@/components/history/history-page-client';
import HistoryEntriesWrapper from '@/components/history/wrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function SearchHistory() {
  const t = await getTranslations('history');

  return (
    <Card className="w-full max-w-3xl mx-auto bg-background mt-10">
      <CardHeader className="flex flex-row items-center space-y-0 pb-4">
        <CardTitle className="text-xl font-semibold">
          {t('yourHistory')}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <HistoryPageClient>
          <Suspense fallback={<HistoryEntriesFallback />}>
            <HistoryEntriesWrapper />
          </Suspense>
        </HistoryPageClient>
      </CardContent>
    </Card>
  );
}
