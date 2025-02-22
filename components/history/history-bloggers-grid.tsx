import { getSearchWithBloggers } from '@/app/actions/search-history';
import { Blogger } from '@/models/blogger/blogger';
import ClientBloggerGrid from './client-blogger-grid';
import { Skeleton } from '../ui/skeleton';

export default async function HistoryBloggersGrid({
  searchId
}: {
  searchId: string;
}) {
  const search = await getSearchWithBloggers(searchId);
  return (
    <ClientBloggerGrid
      bloggers={(search?.bloggers as Blogger[]) || []}
      query={search?.query || 'Unknown query'}
      createdAt={search?.createdAt}
    />
  );
}

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
