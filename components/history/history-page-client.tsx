'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type ReactNode, createContext, useContext, useState } from 'react';

import { Input } from '@/components/ui/input';

type HistorySearchContextType = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

const HistorySearchContext = createContext<
  HistorySearchContextType | undefined
>(undefined);

export const useHistorySearch = () => {
  const context = useContext(HistorySearchContext);
  if (!context) {
    throw new Error('useHistorySearch must be used within HistoryPageClient');
  }
  return context;
};

type HistoryPageClientProps = {
  children: ReactNode;
};

export function HistoryPageClient({ children }: HistoryPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const t = useTranslations('history');

  return (
    <HistorySearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder={t('searchPlaceholder')}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>
      {children}
    </HistorySearchContext.Provider>
  );
}
