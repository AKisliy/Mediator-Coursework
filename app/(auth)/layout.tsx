import Footer from '@/components/navigation/footer';
import Header from '@/components/navigation/header';
import React from 'react';

export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 w-full flex flex-col items-center">
      <Header />
      <div className="flex flex-1 flex-col w-full items-center justify-center py-10 px-6 md:px-0">
        {children}
      </div>
      <Footer />
    </div>
  );
}
