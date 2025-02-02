import { NextRequest, NextResponse } from 'next/server'; // Функция проверки сессии
import { getCurrentUserId } from './utils';

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
