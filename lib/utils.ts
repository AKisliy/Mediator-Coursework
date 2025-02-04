import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
