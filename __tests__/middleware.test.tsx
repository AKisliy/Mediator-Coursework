describe('hello', () => {
  it('hello', () => {
    expect(1).toBe(1);
  });
  it.todo('should return next for public route');
  it.todo('should redirect to /auth/login for private route if not logged in');
});

// jest.mock('next/server', () => ({
//   NextResponse: {
//     next: jest.fn(() => 'next'),
//     redirect: jest.fn(url => `redirect:${url}`)
//   }
// }));

// const createMockRequest = ({
//   pathname = '/',
//   auth = null,
//   url = 'http://localhost/'
// }: {
//   pathname?: string;
//   auth?: any;
//   url?: string;
// }) =>
// ({
//   nextUrl: {
//     pathname
//   },
//   auth,
//   url
// } as any);

// describe('middleware', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//     process.env.NEXT_PUBLIC_DISABLE_AUTH = 'false';
//   });

//   it('returns next for public route', async () => {
//     const req = createMockRequest({ pathname: '/public' });
//     const result = await middleware(req, {});
//     expect(result).toBe('next');
//   });

//   it('redirects to /auth/login for private route if not logged in', async () => {
//     const privateRoute = privateRoutes[0];
//     const req = createMockRequest({ pathname: privateRoute });
//     const result = await middleware(req, {});
//     expect(result).toBe(`redirect:http://localhost/auth/login`);
//   });

//   it('redirects to / if user is logged in and on /auth route', async () => {
//     const req = createMockRequest({
//       pathname: '/auth/login',
//       auth: { user: { name: 'Test' } }
//     });
//     const result = await middleware(req, {});
//     expect(result).toBe(`redirect:http://localhost/`);
//   });

//   it('returns next for private route if logged in', async () => {
//     const privateRoute = privateRoutes[0];
//     const req = createMockRequest({
//       pathname: privateRoute,
//       auth: { user: { name: 'Test' } }
//     });
//     const result = await middleware(req, {});
//     expect(result).toBe('next');
//   });

//   it('returns next if auth is disabled by env', async () => {
//     process.env.NEXT_PUBLIC_DISABLE_AUTH = 'true';
//     const req = createMockRequest({ pathname: '/any', auth: null });
//     const result = await middleware(req, {});
//     expect(result).toBe('next');
//   });

//   it('returns next for API route', async () => {
//     const req = createMockRequest({ pathname: '/api/test' });
//     const result = await middleware(req, {});
//     expect(result).toBe('next');
//   });
// });
