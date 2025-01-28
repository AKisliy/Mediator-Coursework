'use client';

import React, { createContext, useContext, useState } from 'react';

type BloggerQueryContextType = {
  query: string;
  setQuery: (q: string) => void;
  bloggers: any[];
  setBloggers: (bl: any[]) => void;
  loading: boolean;
  setLoading: (l: boolean) => void;
  error: string;
  setError: (e: string) => void;
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
  const [error, setError] = useState('');

  return (
    <BloggerQueryContext.Provider
      value={{
        query,
        setQuery,
        bloggers,
        setBloggers,
        loading,
        setLoading,
        error,
        setError
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
