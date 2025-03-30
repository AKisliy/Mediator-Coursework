'use client';

import React, { useEffect, useState } from 'react';

import { getUserSavedFilters } from '@/app/actions/user.actions';
import { Button } from '@/components/ui/button';
import {
  DropdownMenuGroup,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { UserFilterSet } from '@/types/search-filters';

export default function FilterSetEntriesDropdownGroup() {
  const [filters, setFilters] = useState<UserFilterSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    const fetchSavedFilters = async () => {
      const savedFilters = await getUserSavedFilters();
      setFilters(savedFilters);
      setIsLoading(false);
    };
    fetchSavedFilters();
  }, []);

  if (isLoading) {
    return (
      <div className="grid gap-4 p-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton className="h-9 rounded-lg" key={i} />
        ))}
      </div>
    );
  }

  return (
    <DropdownMenuGroup>
      {!isLoading && (!filters || filters.length === 0) && (
        <DropdownMenuItem>
          <span className="text-muted-foreground">
            У вас нет сохраненных фильтров
          </span>
        </DropdownMenuItem>
      )}
      {filters &&
        filters.map(fiter => (
          <DropdownMenuItem key={fiter.name}>
            <Button className="w-full text-left justify-start" variant="ghost">
              <span>{fiter.name}</span>
            </Button>
          </DropdownMenuItem>
        ))}
    </DropdownMenuGroup>
  );
}
