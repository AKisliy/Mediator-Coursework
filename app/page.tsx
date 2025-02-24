'use client';

import MainBlockHeadline from '@/components/search-main-block/main-block-headline';
import SearchBar from '@/components/search-main-block/search-bar';
import { useBloggersQuery } from '@/context/bloggers-query-provider';
import BloggersGrid from '@/components/search-main-block/bloggers-grid';
import ActionsToolBar from '@/components/search-main-block/actions-tool-bar';
import PageWithGridContainer from '@/components/container/page-with-grid-container';

export default function BloggerSearch() {
  const { bloggers } = useBloggersQuery();
  return (
    <div className="flex flex-col gap-20 min-w-5xl p-5">
      <PageWithGridContainer>
        <MainBlockHeadline />
        <SearchBar />

        {bloggers?.length > 0 && (
          <BloggersGrid bloggers={bloggers} upperChild={<ActionsToolBar />} />
        )}
      </PageWithGridContainer>
    </div>
  );
}
