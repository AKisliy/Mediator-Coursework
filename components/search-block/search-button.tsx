'use client';

import { Loader2, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

import { useBloggersQuery } from '@/context/bloggers-query-provider';
import { useRecommendation } from '@/context/recommendations-provider';

import { Button } from '../ui/button';

export default function SearchButton() {
  const t = useTranslations('search.button');
  const { handleSearch, loading, bloggersCount, query } = useBloggersQuery();
  const { recommendationCount } = useRecommendation();
  return (
    <Button
      onClick={query ? () => handleSearch() : () => {}}
      disabled={
        loading ||
        recommendationCount <= 0 ||
        bloggersCount > recommendationCount
      }
    >
      {loading ? (
        <>
          <Loader2 className="md:mr-2 h-4 w-4 animate-spin" />
          <span className="hidden md:block">{t('searching')}</span>
        </>
      ) : (
        <>
          <Search className="md:mr-2 h-4 w-4" />
          <span className="hidden md:block">{t('search')}</span>
        </>
      )}
    </Button>
  );
}
