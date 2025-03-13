'use client';

import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

interface ProvidersProps {
  children: React.ReactNode;
  session?: Session | null;
}

export default function AuthProvider({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session} key={session?.user.id}>
      {children}
    </SessionProvider>
  );
}
