import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { BloggerQueryProvider } from '@/context/bloggers-query-provider';
import Header from '@/components/navigation/header';
import Footer from '@/components/navigation/footer';
import { RecommendationProvider } from '@/context/recommendations-provider';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900'
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900'
});

export const metadata: Metadata = {
  title: 'Mediator',
  description: 'Find your perfect influencer'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <main className="min-h-screen flex flex-col items-center">
          <div className="flex-1 w-full flex flex-col gap-20 items-center">
            <RecommendationProvider>
              <Header />
              <BloggerQueryProvider>{children}</BloggerQueryProvider>
              <Footer />
            </RecommendationProvider>
          </div>
        </main>
      </body>
    </html>
  );
}
