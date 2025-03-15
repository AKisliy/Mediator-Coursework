import Footer from '@/components/navigation/footer';
import Header from '@/components/navigation/header';
import { Toaster } from '@/components/ui/toaster';
import { RecommendationProvider } from '@/context/recommendations-provider';
import '../globals.css';

export default async function WebAppLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <RecommendationProvider>
        <Header />
        {children}
        <Toaster />
        <Footer />
      </RecommendationProvider>
    </div>
  );
}
