'use client';

import MainBlockHeadline from '@/components/search-main-block/main-block-headline';
import { BloggerQueryProvider } from '@/context/bloggers-query-provider';
import PageWithGridContainer from '@/components/container/page-with-grid-container';
import BloggerSearch from '@/components/search-main-block/blogger-search';

export default function MainPage() {
  return (
    <div className="flex flex-col gap-20 min-w-5xl p-5">
      <PageWithGridContainer>
        <MainBlockHeadline />
        <BloggerQueryProvider>
          <BloggerSearch />
        </BloggerQueryProvider>
      </PageWithGridContainer>
    </div>
  );
}
