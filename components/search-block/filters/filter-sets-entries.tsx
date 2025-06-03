'use client';

import { useTranslations } from 'next-intl';
import React from 'react';

import {
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu';
import { UserFilterSet } from '@/types/search-filters';

interface FilterSetEntriesDropdownGroupProps {
  filters: UserFilterSet[];
  position: string;
  setPosition: (value: string) => void;
}

export default function FilterSetEntriesDropdownGroup({
  filters,
  position,
  setPosition
}: FilterSetEntriesDropdownGroupProps) {
  const t = useTranslations('search.filters');
  return (
    <>
      <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
        {(!filters || filters.length === 0) && (
          <DropdownMenuItem>
            <span className="text-muted-foreground">{t('noSavedFilters')}</span>
          </DropdownMenuItem>
        )}
        {filters && (
          <>
            <DropdownMenuRadioItem value="none" className="text-red-500">
              {t('disableFilter')}
            </DropdownMenuRadioItem>
            {filters.map(filter => (
              <DropdownMenuRadioItem key={filter.name} value={filter.name}>
                {filter.name}
              </DropdownMenuRadioItem>
            ))}
          </>
        )}
      </DropdownMenuRadioGroup>
    </>
  );
}
