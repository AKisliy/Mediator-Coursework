'use client';

import { Input } from '@/components/ui/input';
import { Loader2, Search } from 'lucide-react';
import { useBloggersQuery } from '@/context/bloggers-query-provider';
import { useRecommendation } from '@/context/recommendations-provider';
import { Button } from '../ui/button';
import RecommendationCountInput from './recommendation-count';

export default function SearchBar() {
  const { setQuery, handleSearch, query, loading, bloggersCount } =
    useBloggersQuery();
  const { recommendationCount } = useRecommendation();

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

        <Button
          onClick={handleSearch}
          disabled={
            loading ||
            recommendationCount <= 0 ||
            bloggersCount > recommendationCount
          }
        >
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
        <RecommendationCountInput countLimit={recommendationCount} />
      </div>
    </div>
  );
}
