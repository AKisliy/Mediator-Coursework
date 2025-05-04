'use client';

import React from 'react';

import { useBloggersQuery } from '@/context/bloggers-query-provider';

import { Input } from '../ui/input';

export default function SearchInput() {
  const { setQuery, query } = useBloggersQuery();
  return (
    <Input
      type="text"
      placeholder="Ищу блогеров в тематике эзотерики с аудиторией от 3k подписчиков."
      value={query}
      onChange={e => setQuery(e.target.value)}
      className="flex-grow placeholder:text-sm md:placeholder:text-base"
    />
  );
}
