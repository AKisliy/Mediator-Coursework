import { Skeleton } from '@/components/ui/skeleton';

export function HistoryEntriesFallback() {
  return (
    <div className="grid gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <Skeleton className="h-12 rounded-xl" key={i} />
      ))}
    </div>
  );
}
