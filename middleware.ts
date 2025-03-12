import { NextResponse } from 'next/server';

// export default process.env.NODE_ENV === 'production' ||
// process.env.NEXT_PUBLIC_DISABLE_AUTH !== 'true'
//   ? auth((req: NextApiRequest) => {})
//   : function middleware() {
//       return NextResponse.next();
//     };

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|welcome).*)']
};

const authRoutes = ['/auth/login', '/auth'];

// export default process.env.NODE_ENV === 'production' ||
// process.env.NEXT_PUBLIC_DISABLE_AUTH !== 'true'
//   ? auth(req => {
//       const isLoggedIn = !!req.auth;
//       const isAuthRoute = authRoutes.includes(req.nextUrl.pathname);
//       const isApiAuthRouter = req.nextUrl.pathname.startsWith('/api/auth');

//       if (isApiAuthRouter) {
//         return;
//       }

//       if (isAuthRoute) {
//         if (isLoggedIn) {
//           return Response.redirect(new URL('/dashboard', req.nextUrl));
//         }
//         return;
//       }

//       if (!isLoggedIn && !isAuthRoute) {
//         return Response.redirect(new URL('/auth/login', req.nextUrl));
//       }
//     })
export default function middleware() {
  return NextResponse.next();
}
