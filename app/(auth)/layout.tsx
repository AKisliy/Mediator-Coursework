import React from 'react';

export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center max-w-3xl w-full p-6 md:p-10">
      {children}
    </div>
  );
}
