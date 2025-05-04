'use client';

import { Check, Filter } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { UserFilterSet } from '@/types/search-filters';

import FilterSetEntriesDropdownGroup from './filters/filter-sets-entries';

export default function SavedFiltersDropdown({
  initialFilters,
  appliedFiltersSetName,
  setAppliedFiltersSetName
}: {
  initialFilters: UserFilterSet[];
  appliedFiltersSetName: string;
  setAppliedFiltersSetName: (value: string) => void;
}) {
  const showAppliedCheckMark = appliedFiltersSetName !== 'none';
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter />
          {showAppliedCheckMark && (
            <Check className="absolute top-1 right-1 h-1 w-1 text-green-500" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        onCloseAutoFocus={e => e.preventDefault()}
      >
        <DropdownMenuLabel>Мои фильтры</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* <ScrollArea className="h-40"> */}
        <FilterSetEntriesDropdownGroup
          filters={initialFilters}
          position={appliedFiltersSetName}
          setPosition={setAppliedFiltersSetName}
        />
        {/* </ScrollArea> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
