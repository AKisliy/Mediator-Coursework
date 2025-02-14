import { authOptions } from '@/auth';
import { MOCK_USER_ID } from '@/lib/mock/config';
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse
} from 'next';
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';

// Use it in server contexts
export function auth(
  ...args:
    | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions);
}

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

export async function getCurrentUserId(): Promise<string | undefined> {
  if (process.env.NEXT_PUBLIC_USE_MOCK_USER === 'true') return MOCK_USER_ID;

  const session = await auth();

  if (!session?.user) return undefined;

  return session.user.id;
}
