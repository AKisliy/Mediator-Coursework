import { getCurrentUserId } from '@/app/api/auth/utils';
import { AuthWrapperError } from '@/types/errors/auth-wrapper-error';

import { getContextUserId, setContextUserId } from './auth-context';

type ActionFn<T extends (...args: any[]) => Promise<any>> = T;

export function withAuth<T extends (...args: any[]) => Promise<any>>(
  action: ActionFn<T>
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new AuthWrapperError('User not authenticated');
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
