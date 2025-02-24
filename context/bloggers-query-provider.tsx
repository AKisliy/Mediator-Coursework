'use client';

import { useTaskPolling } from '@/hooks/use-task-polling';
import { toast } from '@/hooks/use-toast';
import { SearchBloggerAPI } from '@/lib/api-access/search';
import React, { createContext, useContext, useState } from 'react';
import { BloggerResponseDTO } from '@/models/response/blogger-dto';
import { getReasonLocalStorageKey } from '@/lib/utils';
import { BloggerEntity } from '@/models/blogger/blogger';
import { getBloggerFromMetadata } from '@/models/blogger/utils';
import { SearchResponseDTO } from '../models/response/search-response';

type BloggerQueryContextType = {
  query: string;
  setQuery: (q: string) => void;
  bloggers: BloggerEntity[];
  setBloggers: (bl: BloggerEntity[]) => void;
  loading: boolean;
  setLoading: (l: boolean) => void;
  handleSearch: () => void;
  bloggersCount: number;
  setBloggersCount: (n: number) => void;
  requestId: string | null;
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
  const [bloggers, setBloggers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [bloggersCount, setBloggersCount] = useState(20);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);

  useTaskPolling<SearchResponseDTO>({
    taskId,
    onSuccess: (data: SearchResponseDTO) => {
      handleBloggersFromResponse(data.recommendations);
      setRequestId(data.uuid);
    },
    onError: (error: any) => {
      toast({
        title: 'Ошибка',
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
      const newTaskId = await SearchBloggerAPI.searchBloggers(
        query,
        bloggersCount
      );
      setTaskId(newTaskId);
      toast({
        title: 'Запрос успешно отправлен ✨',
        description: 'Осталось немного подождать...'
      });
    } catch {
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

  const handleBloggersFromResponse = (bloggersDto: BloggerResponseDTO[]) => {
    const bloggersEntities = bloggersDto.map(blogger =>
      getBloggerFromMetadata(blogger)
    );
    setBloggers(bloggersEntities);
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
        requestId
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
