import { NextAuthRequest } from 'next-auth';
import { NextResponse } from 'next/server';

import { privateRoutes } from '@/routes';

export async function handleMiddlewareLogic(req: NextAuthRequest) {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  if (process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true')
    return NextResponse.next();

  const isPrivateRoute = privateRoutes.includes(nextUrl.pathname);
  const isApiRoute = nextUrl.pathname.startsWith('/api');
  const isAuthRoute =
    nextUrl.pathname.startsWith('/auth') &&
    nextUrl.pathname !== '/auth/signout';

  const { searchParams } = nextUrl;
  const sessionExpired = req.cookies.get('sessionExpired');

  if (
    nextUrl.pathname === '/auth/login' &&
    sessionExpired &&
    !searchParams.has('sessionExpired')
  ) {
    console.log(
      'Session expired, redirecting to login with sessionExpired param'
    );
    const url = req.nextUrl.clone();
    url.searchParams.set('sessionExpired', 'true');

    const response = NextResponse.redirect(url);
    response.cookies.delete('sessionExpired');
    return response;
  }

  if (isApiRoute) return NextResponse.next();

  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (!isLoggedIn && isPrivateRoute) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  return NextResponse.next();
}
