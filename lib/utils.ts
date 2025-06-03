import { botttsNeutral } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import { type ClassValue, clsx } from 'clsx';
import { format, formatDistanceToNow } from 'date-fns';
import { enUS, ru } from 'date-fns/locale';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { twMerge } from 'tailwind-merge';
import { generateUsername } from 'unique-username-generator';

import { Blogger } from '@/types/blogger';
import { FilterValue } from '@/types/search-filters';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getReasonLocalStorageKey(
  bloggerId: string,
  requestId: string | null
) {
  if (!requestId) throw new Error('Невозможно получить причину без ID запроса');
  return `reason-${bloggerId}-${requestId}`;
}

export function exportBloggersToCSV(bloggers: Blogger[]) {
  if (!bloggers.length) return;

  bloggers.map(blogger =>
    Object.entries(blogger).forEach(([key, value]) => {
      (blogger as any)[key] = value;
    })
  );

  const csv = Papa.unparse(bloggers);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, 'bloggers.csv');
}

export const formatTimestampToNow = (date?: Date, locale: string = 'ru') => {
  if (!date) return 'Unknown date';
  const formattedTimestamp = formatDistanceToNow(date, {
    addSuffix: true,
    locale: locale === 'ru' ? ru : enUS
  });

  return formattedTimestamp;
};

export const formatDate = (date?: Date) => {
  if (!date) return 'XX.XX.XXXX';
  const formattedDate = format(date, 'dd.MM.yyyy', { locale: ru });
  return formattedDate;
};

export const delay = (ms: number) =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

function intlFormat(num: number) {
  return new Intl.NumberFormat().format(Math.round(num * 10) / 10);
}

export function getFriendlyNumberWithLetter(num: number) {
  if (num >= 1000000) return `${intlFormat(num / 1000000)}M`;
  if (num >= 1000) return `${intlFormat(num / 1000)}k`;
  return intlFormat(num);
}

export function getFriendlyNumberInThousands(num: number) {
  if (num >= 1000) return intlFormat(num / 1000);
  return intlFormat(num);
}

export function enrichQueryWithFilters(query: string, filters: FilterValue[]) {
  return filters.reduce((acc, filter) => {
    if (filter.value[0] === filter.min && filter.value[1] === filter.max)
      return acc;
    return `${acc} ${filter.name}: от ${filter.value[0]} до ${filter.value[1]}`;
  }, query);
}

export function generateUniqueUsername(): string {
  const username = generateUsername('', 2);
  return username;
}

export function generateAvatar(name: string): string {
  const avatar = createAvatar(botttsNeutral, {
    seed: name
  });

  return avatar.toDataUri();
}
