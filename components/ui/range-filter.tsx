'use client';

import { useState } from 'react';

import { cn } from '@/lib/utils';

import { Label } from './label';
import { Slider } from './slider';

interface RangeFilterProps {
  filterName: string;
  min: number;
  max: number;
  value: [number, number];
  defaultValue: [number, number];
  step?: number;
  measure?: string;
  onChange?: (newValues: [number, number]) => void;
  minStepsBetweenThumbs?: number;
  formatValue?: (value: number) => string;
}

export function RangeFilter({
  filterName,
  min,
  max,
  value,
  defaultValue,
  step = 1,
  measure,
  onChange,
  minStepsBetweenThumbs = 10_000,
  formatValue
}: RangeFilterProps) {
  const displayValues = value || defaultValue || [min, max];

  const handleValueChange = (newValues: any) => {
    onChange?.(newValues);
  };

  return (
    <div className="grid gap-4 p-4 w-full border border-[#14424C]/20 rounded-[12px]">
      <Label htmlFor={filterName} className="text-sm text-gray-500">
        {filterName}
      </Label>
      <Slider
        value={displayValues}
        minStepsBetweenThumbs={minStepsBetweenThumbs}
        max={max}
        min={min}
        step={step}
        onValueChange={handleValueChange}
        className={cn('w-full')}
      />
      <div className="flex gap-2 flex-wrap">
        <ol className="flex items-center w-full gap-3">
          {displayValues.map((_, index) => (
            <li
              key={index}
              className="flex items-center text-sm justify-between w-full border px-3 h-10 rounded-md"
            >
              <span>
                {formatValue
                  ? formatValue(displayValues[index])
                  : displayValues[index]}
              </span>
              <span>{measure}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
