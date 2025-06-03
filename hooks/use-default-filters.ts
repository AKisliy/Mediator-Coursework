'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { defaultFilters } from '@/lib/filters';
import { FilterValue } from '@/types/search-filters';

export function useDefaultFilters(): FilterValue[] {
  const t = useTranslations('search.filters');
  const locale = useLocale();

  return useMemo(
    () =>
      defaultFilters.map(filter => ({
        ...filter,
        name: t(`${filter.id}.name`),
        measure: t(`${filter.id}.measure`),
        stringTemplate: t(`${filter.id}.stringTemplate`),
        valueFormatter: (value: number) => {
          return new Intl.NumberFormat(locale, {
            notation: value >= 1000000 ? 'compact' : 'standard',
            maximumFractionDigits: 0
          }).format(value);
        }
      })),
    [locale, t]
  );
}
