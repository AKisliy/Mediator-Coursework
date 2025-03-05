import { Check, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { useBloggersQuery } from '@/context/bloggers-query-provider';
import { Button } from '../ui/button';
import { RangeFilter } from '../ui/range-filter';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';

interface FilterPopoverProps {
  setIsFiltersUsed: (isUsed: boolean) => void;
  isFiltersUsed: boolean;
}

export default function FiltersDialogButton({
  setIsFiltersUsed,
  isFiltersUsed
}: FilterPopoverProps) {
  const { filters, setFilters } = useBloggersQuery();

  const [isSaved, setIsSaved] = useState(isFiltersUsed);
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFiltersSave = () => {
    setIsSaved(true);
    setIsFiltersUsed(true);
    setFilters(localFilters);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative flex-grow px-3">
          <SlidersHorizontal className="h-5 w-5" />
          {isFiltersUsed && (
            <Check className="absolute top-1 right-1 h-1 w-1 text-green-500" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="h-3/5 overflow-y-scroll">
        <DialogHeader className="p-3">
          <DialogTitle>Фильтры</DialogTitle>
          <DialogDescription>Настройте параметры поиска</DialogDescription>
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
                setIsSaved(false);
              }}
              measure={value.measure}
              formatValue={value.valueFormatter}
            />
          ))}
        </div>
        <DialogFooter className="sticky -bottom-6 w-full h-full backdrop-blur-sm bg-black/80 p-4">
          <Button onClick={handleFiltersSave} className="w-1/3">
            {isSaved ? 'Применено ✅' : 'Применить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
