'use client';

import { type ReactNode, useState } from 'react';

import { HistorySearchContext } from '@/hooks/use-history-search';

type HistorySearchProviderProps = {
  children: ReactNode;
};

export function HistorySearchProvider({
  children
}: HistorySearchProviderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <HistorySearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </HistorySearchContext.Provider>
  );
}
