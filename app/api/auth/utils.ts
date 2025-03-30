import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/auth';
import { MOCK_USER_ID } from '@/lib/mock/config';

export function withAuth(
  handler: (req: NextRequest, userId: string) => Promise<NextResponse>
) {
  return async function (req: NextRequest) {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        { error: 'Пользователь не авторизован' },
        { status: 401 }
      );
    }

    return handler(req, userId);
  };
}

export async function verifySessionAndGetId() {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error('Пользователь не авторизован');
  }

  return userId;
}

export async function getCurrentUserId(): Promise<string | undefined> {
  if (process.env.NEXT_PUBLIC_USE_MOCK_USER === 'true') return MOCK_USER_ID;

  const session = await auth();

  if (!session?.user) return undefined;

  return session.user.id;
}
