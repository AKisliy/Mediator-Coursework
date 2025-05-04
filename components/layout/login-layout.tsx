export default function LoginLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted max-w-3xl p-6 md:p-10">
      {children}
    </div>
  );
}
