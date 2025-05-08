'use client';

import React, { createContext, useContext, useState } from 'react';

import { startSearchTask } from '@/app/actions/search.action';
import { useTaskPolling } from '@/hooks/use-task-polling';
import { toast } from '@/hooks/use-toast';
import { defaultFilters } from '@/lib/filters';
import { getReasonLocalStorageKey } from '@/lib/utils';
import { Blogger } from '@/types/blogger';
import { FilterValue } from '@/types/search-filters';

import { SearchResponse } from '../models/response/search-response';

type BloggerQueryContextType = {
  query: string;
  setQuery: (q: string) => void;
  bloggers: Blogger[];
  setBloggers: (bl: Blogger[]) => void;
  loading: boolean;
  setLoading: (l: boolean) => void;
  handleSearch: () => void;
  bloggersCount: number;
  setBloggersCount: (n: number) => void;
  requestId: string | null;
  filters: FilterValue[];
  setFilters: (f: FilterValue[]) => void;
};

const BloggerQueryContext = createContext<BloggerQueryContextType | undefined>(
  undefined
);

export const BloggerQueryProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [query, setQuery] = useState('');
  const [bloggers, setBloggers] = useState<Blogger[]>([]);
  const [loading, setLoading] = useState(false);
  const [bloggersCount, setBloggersCount] = useState(20);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterValue[]>(defaultFilters);

  useTaskPolling<SearchResponse>({
    taskId,
    onSuccess: (data: SearchResponse) => {
      setBloggers(data.recommendations);
      setRequestId(data.uuid);
    },
    onError: (error: any) => {
      toast({
        title: 'Ошибка ☠️',
        description: error,
        variant: 'destructive'
      });
    },
    onComplete: () => {
      setTaskId(null);
      setLoading(false);
    }
  });

  const handleSearch = async () => {
    try {
      handleGridClearing();
      setLoading(true);
      const searchJob = await startSearchTask(query, filters, bloggersCount);
      if (!searchJob.jobId) throw new Error('Не удалось отправить запрос');
      setTaskId(searchJob.jobId);
      toast({
        title: 'Запрос успешно отправлен ✨',
        description: 'Осталось немного подождать...'
      });
    } catch {
      setLoading(false);
      toast({
        title: 'Ошибка ☠️',
        description: 'Произошла ошибка, пожалуйста, попробуйте снова',
        variant: 'destructive'
      });
    }
  };

  const handleGridClearing = () => {
    if (!requestId) return;
    bloggers?.forEach(blogger => {
      const reasonKey = getReasonLocalStorageKey(blogger.id, requestId);
      localStorage.removeItem(reasonKey);
    });
    setBloggers([]);
  };

  return (
    <BloggerQueryContext.Provider
      value={{
        query,
        setQuery,
        bloggers,
        setBloggers,
        loading,
        setLoading,
        handleSearch,
        bloggersCount,
        setBloggersCount,
        requestId,
        filters,
        setFilters
      }}
    >
      {children}
    </BloggerQueryContext.Provider>
  );
};

export const useBloggersQuery = () => {
  const context = useContext(BloggerQueryContext);
  if (context === undefined) {
    throw new Error(
      'useBloggersQuery должен использоваться внутри RecommendationProvider'
    );
  }
  return context;
};
