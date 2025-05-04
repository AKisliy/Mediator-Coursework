import Footer from '@/components/navigation/footer';
import Header from '@/components/navigation/header';
import { AppSidebar } from '@/components/ui/app-sidebar';
import { Toaster } from '@/components/ui/toaster';
import { RecommendationProvider } from '@/context/recommendations-provider';

import '../globals.css';

export default async function WebAppLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex-1 w-full h-full flex flex-col items-center">
      <RecommendationProvider>
        <div className="md:hidden">
          <AppSidebar />
        </div>
        <Header />
        {children}
        <Toaster />
        <Footer />
      </RecommendationProvider>
    </div>
  );
}
