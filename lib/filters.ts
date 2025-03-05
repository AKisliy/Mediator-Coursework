import { FilterValue } from '@/types/search-filters';

export const defaultFilters: FilterValue[] = [
  {
    min: 0,
    max: 10_000_000,
    name: 'Количество подписчиков',
    value: [0, 10_000_000],
    minStepsBetweenThumbs: 1,
    stepSize: 1000,
    measure: 'подписчиков',
    stringTemplate: 'от %s до %s'
  },
  {
    min: 0,
    max: 100,
    name: 'ERR',
    value: [0, 100],
    minStepsBetweenThumbs: 10,
    stepSize: 1,
    measure: '%'
  },
  {
    min: 0,
    max: 100,
    name: 'ER',
    value: [0, 100],
    minStepsBetweenThumbs: 10,
    stepSize: 1,
    measure: '%'
  },
  {
    min: 0,
    max: 1_000_000,
    name: 'Средний охват поста',
    value: [0, 1_000_000],
    minStepsBetweenThumbs: 1,
    stepSize: 1000,
    measure: 'подписчиков'
  },
  {
    min: 0,
    max: 1_000_000,
    name: 'Средний прирост подписчиков в месяц',
    value: [0, 1_000_000],
    minStepsBetweenThumbs: 1,
    stepSize: 1000,
    measure: 'подписчиков'
  },
  {
    min: 0,
    max: 1_000_000,
    name: 'Средний охват рекламного поста',
    value: [0, 1_000_000],
    minStepsBetweenThumbs: 1,
    stepSize: 1000,
    measure: 'подписчиков'
  }
];
