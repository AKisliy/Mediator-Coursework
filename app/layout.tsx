import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
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
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <AuthProvider session={session}>
      <html
        lang={locale}
        className={geistSans.className}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages}>
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
        </NextIntlClientProvider>
      </html>
    </AuthProvider>
  );
}
