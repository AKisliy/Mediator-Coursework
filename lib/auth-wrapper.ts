import { redirect } from 'next/navigation';

import { getCurrentUserId } from '@/app/api/auth/utils';

import { getContextUserId, setContextUserId } from './auth-context';

type ActionFn<T extends (...args: any[]) => Promise<any>> = T;

export function withAuth<T extends (...args: any[]) => Promise<any>>(
  action: ActionFn<T>
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const userId = await getCurrentUserId();
    if (!userId) {
      redirect('/auth/login');
    }
    setContextUserId(userId);

    try {
      return await action(...args);
    } finally {
      setContextUserId(null);
    }
  };
}

export { getContextUserId };
