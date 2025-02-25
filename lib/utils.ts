import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Blogger } from '@/types/blogger';

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

export const formatTimestamp = (date?: Date) => {
  if (!date) return 'Unknown date';
  const formattedDate = formatDistanceToNow(date, {
    addSuffix: true,
    locale: ru
  });

  return formattedDate;
};

export const delay = (ms: number) =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });
