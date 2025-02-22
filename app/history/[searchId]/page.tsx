import HistoryBloggersGrid, {
  HistoryBloggersGridFallback
} from '@/components/history/history-bloggers-grid';
import { Suspense } from 'react';

export default function HistoryEntryPage({
  params
}: {
  params: { searchId: string };
}) {
  return (
    <Suspense fallback={<HistoryBloggersGridFallback />}>
      <HistoryBloggersGrid searchId={params.searchId} />
    </Suspense>
  );
}
