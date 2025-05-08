/**
 * @jest-environment node
 */
import { NextResponse } from 'next/server';

import { handleMiddlewareLogic } from '@/lib/middleware-logic';
import { privateRoutes } from '@/routes';

const createMockRequest = (props: Partial<any> = {}) => ({
  auth: null,
  nextUrl: {
    pathname: '/'
  },
  url: 'http://localhost/',
  ...props
});

describe('middleware', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_DISABLE_AUTH = 'false';
  });

  it('should skip auth if NEXT_PUBLIC_DISABLE_AUTH is true', async () => {
    process.env.NEXT_PUBLIC_DISABLE_AUTH = 'true';
    const req = createMockRequest();
    const res = await handleMiddlewareLogic(req as any);
    expect(res).toEqual(NextResponse.next());
  });

  it('should redirect unauthenticated user from private route', async () => {
    const req = createMockRequest({
      nextUrl: { pathname: privateRoutes[0] },
      url: `http://localhost${privateRoutes[0]}`
    });
    const res = await handleMiddlewareLogic(req as any);
    expect(res.headers.get('location')).toBe('http://localhost/auth/login');
  });

  it('should redirect logged-in user away from /auth', async () => {
    const req = createMockRequest({
      auth: { user: { id: '123' } },
      nextUrl: { pathname: '/auth/login' },
      url: 'http://localhost/auth/login'
    });
    const res = await handleMiddlewareLogic(req as any);
    expect(res.headers.get('location')).toBe('http://localhost/');
  });

  it('should allow access to API route', async () => {
    const req = createMockRequest({
      nextUrl: { pathname: '/api/test' }
    });
    const res = await handleMiddlewareLogic(req as any);
    expect(res).toEqual(NextResponse.next());
  });
});
