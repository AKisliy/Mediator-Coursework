import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import localFont from 'next/font/local';

import { auth } from '@/auth';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import AuthProvider from '@/context/auth-provider';

import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900'
});

export const metadata: Metadata = {
  title: 'Mediator',
  description: 'Find your perfect influencer with AI ✨'
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <AuthProvider session={session}>
      <html lang="en" className={geistSans.className} suppressHydrationWarning>
        <body className="bg-background text-foreground">
          <SidebarProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <main className="min-h-screen w-full items-center">
                {children}
              </main>
              <Toaster />
            </ThemeProvider>
          </SidebarProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
