'use client';

import React, { createContext, useContext, useState } from 'react';

import { startSearchTask } from '@/app/actions/search.action';
import { useDefaultFilters } from '@/hooks/use-default-filters';
import { useTaskPolling } from '@/hooks/use-task-polling';
import { toast } from '@/hooks/use-toast';
import { getReasonLocalStorageKey } from '@/lib/utils';
import { Blogger } from '@/types/blogger';
import { FilterValue } from '@/types/search-filters';

import { SearchResponse } from '../models/response/search-response';
import { useRecommendation } from './recommendations-provider';

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
  const { decreaseReccomendations } = useRecommendation();
  const [bloggers, setBloggers] = useState<Blogger[]>([]);
  const [loading, setLoading] = useState(false);
  const [bloggersCount, setBloggersCount] = useState(20);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const tranlsatedDefaultFilters = useDefaultFilters();
  const [filters, setFilters] = useState<FilterValue[]>(
    tranlsatedDefaultFilters
  );

  useTaskPolling<SearchResponse>({
    taskId,
    onSuccess: (data: SearchResponse) => {
      decreaseReccomendations(data.recommendations.length);
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
      filters.map(filter => {
        filter.valueFormatter = undefined;
        return filter;
      });
      const searchJob = await startSearchTask(query, filters, bloggersCount);
      if (!searchJob.jobId) throw new Error('Не удалось отправить запрос');
      setTaskId(searchJob.jobId);
      toast({
        title: 'Запрос успешно отправлен ✨',
        description: 'Осталось немного подождать...'
      });
    } catch (error) {
      console.error('Ошибка при отправке запроса:', error);
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
