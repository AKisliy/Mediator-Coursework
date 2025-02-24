import { Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Suspense } from 'react';
import HistoryEntriesWrapper from '@/components/history/wrapper';
import { HistoryEntriesFallback } from '@/components/history/fallback';

export default async function SearchHistory() {
  return (
    <Card className="w-full max-w-3xl mx-auto bg-background">
      <CardHeader className="flex flex-row items-center space-y-0 pb-4">
        <CardTitle className="text-xl font-semibold">Ваша история</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Искать запросы..." />
        </div>
        <Suspense fallback={<HistoryEntriesFallback />}>
          <HistoryEntriesWrapper />
        </Suspense>
      </CardContent>
    </Card>
  );
}
