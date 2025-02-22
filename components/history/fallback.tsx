import { Skeleton } from '../ui/skeleton';

export function HistoryBloggersGridFallback() {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 auto-rows-fr">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="flex w-full rounded-xl" />
        ))}
      </div>
      <p className="text-center mt-4 text-muted-foreground">
        Tap to open a card.
      </p>
    </>
  );
}
