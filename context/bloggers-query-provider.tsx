'use client';

import { generateMockBloggers } from '@/lib/mock/bloggers';
import React, { createContext, useContext, useState } from 'react';

type BloggerQueryContextType = {
  query: string;
  setQuery: (q: string) => void;
  bloggers: any[];
  setBloggers: (bl: any[]) => void;
  loading: boolean;
  setLoading: (l: boolean) => void;
  handleSearch: () => void;
  bloggersCount: number;
  setBloggersCount: (n: number) => void;
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

  const handleSearch = () => {
    if (process.env.NEXT_PUBLIC_USE_MOCK_API === 'true') handleSearchMock();
    console.log(`Handling search for: ${query}`);
  };

  const handleSearchMock = () => {
    setLoading(true);
    setBloggers([]);

    setTimeout(() => {
      const results = generateMockBloggers(query);
      setBloggers(results);
      setLoading(false);
    }, 1000);
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
        setBloggersCount
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
