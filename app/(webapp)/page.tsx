'use client';

import PageWithGridContainer from '@/components/container/page-with-grid-container';
import MainBlockHeadline from '@/components/main-block-headline';
import BloggerSearch from '@/components/search-block/blogger-search';
import { BloggerQueryProvider } from '@/context/bloggers-query-provider';

export default function MainPage() {
  return (
    <div className="flex flex-col gap-20 max-w-3xl w-full p-5 mt-20">
      <PageWithGridContainer>
        <MainBlockHeadline />
        <BloggerQueryProvider>
          <BloggerSearch />
        </BloggerQueryProvider>
      </PageWithGridContainer>
    </div>
  );
}
