'use client';

import ActionsToolBar from '@/components/search-main-block/actions-tool-bar';
import MainBlockHeadline from '@/components/search-main-block/main-block-headline';
import SearchBar from '@/components/search-main-block/search-bar';
import SmallBloggerCard from '@/components/cards/small-blogger-card';
import { useBloggersQuery } from '@/context/bloggers-query-provider';
import { Blogger } from '@/models/blogger';
import { AnimatePresence } from 'framer-motion';
import FullBloggerCard from '@/components/cards/full-blogger-card';
import { useState } from 'react';

export default function BloggerSearch() {
  const { bloggers } = useBloggersQuery();
  const [selectedBlogger, setSelectedBlogger] = useState<Blogger | null>(null);

  return (
    <div className={`flex flex-col gap-20 max-w-5xl p-5`}>
      <div className="container mx-auto p-4 max-w-4xl w-full">
        <MainBlockHeadline />
        <SearchBar />
        {bloggers?.length > 0 && (
          <>
            <ActionsToolBar />
            <div className="grid gap-6 md:grid-cols-2 auto-rows-fr">
              {bloggers.map(blogger => {
                const bloggerEntity = Blogger.getBloggerFromObject(blogger);
                return (
                  <SmallBloggerCard
                    key={bloggerEntity.id}
                    blogger={bloggerEntity}
                    onClick={() => setSelectedBlogger(bloggerEntity)}
                  />
                );
              })}
            </div>
            <p className="text-center mt-4 text-muted-foreground">
              Tap to open a card.
            </p>
          </>
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
