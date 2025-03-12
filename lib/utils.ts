import { getVerificationTokenByEmail } from '@/data/token';
import { Blogger } from '@/types/blogger';
import { FilterValue } from '@/types/search-filters';
import { clsx, type ClassValue } from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { twMerge } from 'tailwind-merge';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from './db/prisma';

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

export const generateVerificationToken = async (email: string) => {
  // Generate a random token
  const token = uuidv4();
  const expires = new Date().getTime() + 1000 * 60 * 60 * 1; // 1 hours

  // Check if a token already exists for the user
  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: existingToken.identifier,
          token: existingToken.token
        }
      }
    });
  }

  // Create a new verification token
  const verificationToken = await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires: new Date(expires)
    }
  });

  return verificationToken;
};
