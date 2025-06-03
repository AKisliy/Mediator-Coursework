'use client';

import { createContext, useContext } from 'react';

type HistorySearchContextType = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

export const HistorySearchContext = createContext<
  HistorySearchContextType | undefined
>(undefined);

export const useHistorySearch = () => {
  const context = useContext(HistorySearchContext);
  if (!context) {
    throw new Error(
      'useHistorySearch must be used within HistorySearchProvider'
    );
  }
  return context;
};
