import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';

import { authOptions } from './auth.config';
import { privateRoutes } from './routes';

const { auth } = NextAuth(authOptions);

export default auth(async req => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;
  console.log('PATH:', nextUrl.pathname, 'isLoggedIn:', isLoggedIn);

  if (process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true')
    return NextResponse.next();

  const isPrivateRoute = privateRoutes.includes(nextUrl.pathname);
  console.log(`isPrivateRoute:${isPrivateRoute}`);
  const isApiRoute = nextUrl.pathname.startsWith('/api');
  const isAuthRoute =
    nextUrl.pathname.startsWith('/auth') &&
    nextUrl.pathname !== '/auth/signout';
  console.log(`isApiRoute:${isApiRoute}`);

  if (isApiRoute) return NextResponse.next();

  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (!isLoggedIn && isPrivateRoute) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)'
  ]
};
