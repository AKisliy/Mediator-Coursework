describe('hello', () => {
  it('hello', () => {
    expect(1).toBe(1);
  });
  it.todo('should return next for public route');
  it.todo('should redirect to /auth/login for private route if not logged in');
});
