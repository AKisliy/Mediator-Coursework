import { Check, SlidersHorizontal } from 'lucide-react';
import { forwardRef, useState } from 'react';

import { useBloggersQuery } from '@/context/bloggers-query-provider';
import { useMediaQuery } from '@/hooks/use-media-query';

import { Button, ButtonProps } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '../ui/drawer';
import { RangeFilter } from '../ui/range-filter';
import FilterSavingDialogButton from './filter-saving-button';
import SavedFiltersDropdown from './saved-filters';

interface FilterPopoverProps {
  setIsFiltersApplied: (isUsed: boolean) => void;
  isFiltersApplied: boolean;
}

export default function FiltersDialogButton({
  setIsFiltersApplied,
  isFiltersApplied
}: FilterPopoverProps) {
  const { filters, setFilters } = useBloggersQuery();

  const [isApplied, setIsApplied] = useState(isFiltersApplied);
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFiltersApply = () => {
    setIsApplied(true);
    setIsFiltersApplied(true);
    setFilters(localFilters);
  };

  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop)
    return (
      <Dialog>
        <DialogTrigger asChild>
          <FilterDialogTrigger isFiltersApplied={isFiltersApplied} />
        </DialogTrigger>
        <DialogContent className="h-3/5 overflow-y-scroll">
          <DialogHeader className="p-3 flex flex-row justify-between">
            <div className="flex flex-col gap-2">
              <DialogTitle>Фильтры</DialogTitle>
              <DialogDescription>Настройте параметры поиска</DialogDescription>
            </div>
            <div className="flex flex-row gap-2">
              <FilterSavingDialogButton filters={filters} />
              <SavedFiltersDropdown />
            </div>
          </DialogHeader>
          <div className="p-3 space-y-3">
            {filters.map((value, idx) => (
              <RangeFilter
                key={idx}
                filterName={value.name}
                defaultValue={[value.value[0], value.value[1]]}
                min={value.min}
                max={value.max}
                step={value.stepSize}
                minStepsBetweenThumbs={value.minStepsBetweenThumbs}
                onChange={([min, max]) => {
                  setLocalFilters(prev => {
                    const newFilters = [...prev];
                    newFilters[idx].value = [min, max];
                    return newFilters;
                  });
                  setIsApplied(false);
                }}
                measure={value.measure}
                formatValue={value.valueFormatter}
              />
            ))}
          </div>
          <DialogFooter className="sticky -bottom-6 w-full h-full backdrop-blur-sm bg-black/80 p-4">
            <Button onClick={handleFiltersApply} className="w-1/3">
              {isApplied ? 'Применено ✅' : 'Применить'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <FilterDialogTrigger isFiltersApplied={isFiltersApplied} />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Фильтры</DrawerTitle>
          <DrawerDescription>Настройте параметры поиска</DrawerDescription>
        </DrawerHeader>
        <div className="p-3 space-y-3">
          {filters.map((value, idx) => (
            <RangeFilter
              key={idx}
              filterName={value.name}
              defaultValue={[value.value[0], value.value[1]]}
              min={value.min}
              max={value.max}
              step={value.stepSize}
              minStepsBetweenThumbs={value.minStepsBetweenThumbs}
              onChange={([min, max]) => {
                setLocalFilters(prev => {
                  const newFilters = [...prev];
                  newFilters[idx].value = [min, max];
                  return newFilters;
                });
                setIsApplied(false);
              }}
              measure={value.measure}
              formatValue={value.valueFormatter}
            />
          ))}
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

const FilterDialogTrigger = forwardRef<
  HTMLButtonElement,
  ButtonProps & { isFiltersApplied: boolean }
>(({ isFiltersApplied, ...props }, ref) => (
  <Button
    ref={ref}
    {...props}
    variant="ghost"
    size="icon"
    className="relative flex-grow px-3"
  >
    <SlidersHorizontal className="h-5 w-5" />
    {isFiltersApplied && (
      <Check className="absolute top-1 right-1 h-1 w-1 text-green-500" />
    )}
  </Button>
));

FilterDialogTrigger.displayName = 'FilterDialogTrigger';
