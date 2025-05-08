import NextAuth from 'next-auth';

import { authOptions } from './auth.config';
import { handleMiddlewareLogic } from './lib/middleware-logic';

const { auth } = NextAuth(authOptions);

export default auth(handleMiddlewareLogic);

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)'
  ]
};
