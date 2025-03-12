'use client';

import { Button } from '@/components/ui/button';
import { loadMoreSearchEntries } from '@/data/history';
import { UserSearch } from '@prisma/client';
import { Plus } from 'lucide-react';
import { useState, useTransition } from 'react';

interface LoadMoreButtonProps {
  initialCount: number;
  onLoadMore: (newEntries: UserSearch[]) => void;
}

export default function LoadMoreButton({
  initialCount,
  onLoadMore
}: LoadMoreButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [isPending, startTransition] = useTransition();

  const handleLoadMore = () => {
    startTransition(async () => {
      const newEntries = await loadMoreSearchEntries(count);
      setCount(count + (newEntries?.length ?? 0));
      onLoadMore(newEntries ?? []);
    });
  };

  if (count % 10 !== 0) return null;

  return (
    <Button
      onClick={handleLoadMore}
      variant="outline"
      className="w-full"
      disabled={isPending}
    >
      {isPending ? (
        'Loading...'
      ) : (
        <>
          <Plus className="h-4 w-4 mr-2" />
          Load More
        </>
      )}
    </Button>
  );
}
