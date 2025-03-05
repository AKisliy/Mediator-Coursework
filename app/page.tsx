'use client';

import MainBlockHeadline from '@/components/main-block-headline';
import { BloggerQueryProvider } from '@/context/bloggers-query-provider';
import PageWithGridContainer from '@/components/container/page-with-grid-container';
import BloggerSearch from '@/components/search-block/blogger-search';

export default function MainPage() {
  return (
    <div className="flex flex-col gap-20 max-w-3xl w-full p-5">
      <PageWithGridContainer>
        <MainBlockHeadline />
        <BloggerQueryProvider>
          <BloggerSearch />
        </BloggerQueryProvider>
      </PageWithGridContainer>
    </div>
  );
}
