import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { BloggerResponseDTO } from '@/models/response/blogger-dto';

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

export function exportBloggersToCSV(bloggers: BloggerResponseDTO[]) {
  if (!bloggers.length) return;

  bloggers.map(blogger =>
    Object.entries(blogger.metadata).forEach(([key, value]) => {
      (blogger as any)[key] = value;
    })
  );

  const csv = Papa.unparse(bloggers);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, 'bloggers.csv');
}
