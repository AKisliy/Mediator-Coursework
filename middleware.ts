import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default process.env.NODE_ENV === 'production' ||
!process.env.NEXT_PUBLIC_DISABLE_AUTH
  ? withAuth({
      pages: {
        signIn: '/auth/login'
      }
    })
  : function middleware() {
      return NextResponse.next();
    };

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|welcome).*)']
};
