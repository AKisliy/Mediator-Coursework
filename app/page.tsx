'use client';

import MainBlockHeadline from '@/components/search-main-block/main-block-headline';
import SearchBar from '@/components/search-main-block/search-bar';
import { useBloggersQuery } from '@/context/bloggers-query-provider';
import { Blogger } from '@/models/blogger/blogger';
import { AnimatePresence } from 'framer-motion';
import FullBloggerCard from '@/components/cards/full-blogger-card';
import { useState } from 'react';
import BloggersGrid from '@/components/search-main-block/bloggers-grid';

export default function BloggerSearch() {
  const { bloggers } = useBloggersQuery();
  const [selectedBlogger, setSelectedBlogger] = useState<Blogger | null>(null);

  return (
    <div className={`flex flex-col gap-20 max-w-5xl p-5`}>
      <div className="container mx-auto p-4 max-w-4xl w-full">
        <MainBlockHeadline />
        <SearchBar />

        {bloggers?.length > 0 && (
          <BloggersGrid setSelectedBlogger={setSelectedBlogger} />
        )}

        <AnimatePresence>
          {selectedBlogger && (
            <FullBloggerCard
              blogger={selectedBlogger}
              onClose={() => setSelectedBlogger(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
