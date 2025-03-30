import { Filter } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { ScrollArea } from '../ui/scroll-area';
import FilterSetEntriesDropdownGroup from './filters/filter-sets-entries';

export default function SavedFiltersDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Filter />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Мои фильтры</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-40">
          <FilterSetEntriesDropdownGroup />
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
