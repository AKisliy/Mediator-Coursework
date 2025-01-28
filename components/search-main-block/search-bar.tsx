'use client';

import { Input } from '@/components/ui/input';
import { Loader2, Search } from 'lucide-react';
import { useState } from 'react';
import { useBloggersQuery } from '@/context/bloggers-query-provider';
import { generateMockBloggers } from '@/lib/mock/bloggers';
import { Button } from '../ui/button';
import RecommendationCountInput from './recommendation-count';

export default function SearchBar() {
  const { setQuery, setLoading, setError, setBloggers, query, loading } =
    useBloggersQuery();
  const [bloggersCount, setBloggersCount] = useState(20);

  const handleSearchMock = () => {
    setLoading(true);
    setBloggers([]);
    setError('');

    setTimeout(() => {
      const results = generateMockBloggers(query);
      setBloggers(results);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col space-y-4 mb-8">
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Ищу блогеров в тематике эзотерики с аудиторией от 3k подписчиков."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="flex-grow"
        />

        <Button onClick={handleSearchMock} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Ищем...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Найти
            </>
          )}
        </Button>
      </div>
      <div className="flex justify-end">
        <RecommendationCountInput
          count={bloggersCount}
          setCount={setBloggersCount}
          countLimit={20}
        />
      </div>
    </div>
  );
}
