'use client';

import React, { useState } from 'react';

import { UserFilterSet } from '@/types/search-filters';

import FiltersDialogButton from './filters-dialog-button';

export default function SearchFilters({
  initialFilters
}: {
  initialFilters: UserFilterSet[];
}) {
  const [isFiltersUsed, setIsFiltersUsed] = useState(false);
  return (
    <FiltersDialogButton
      initialFilters={initialFilters}
      setIsFiltersApplied={setIsFiltersUsed}
      isFiltersApplied={isFiltersUsed}
    />
  );
}
