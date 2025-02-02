import { MOCK_USER_ID } from '@/lib/mock/config';

export async function getCurrentUserId(): Promise<string | undefined> {
  if (process.env.NEXT_PUBLIC_USE_MOCK_USER === 'true') return MOCK_USER_ID;

  // some logic with auth

  return undefined;
}
