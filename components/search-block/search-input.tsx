'use client';

import { useTranslations } from 'next-intl';
import React from 'react';

import { useBloggersQuery } from '@/context/bloggers-query-provider';

import { Input } from '../ui/input';

export default function SearchInput() {
  const t = useTranslations('search');
  const { setQuery, query } = useBloggersQuery();
  return (
    <Input
      type="text"
      placeholder={t('searchbar.placeholder')}
      value={query}
      onChange={e => setQuery(e.target.value)}
      className="flex-grow placeholder:text-sm md:placeholder:text-base"
    />
  );
}
