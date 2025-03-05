import { useBloggersQuery } from '@/context/bloggers-query-provider';
import BloggersGrid from '../bloggers-grid/bloggers-grid';
import SearchBar from './search-bar';
import ActionsToolBar from './actions-tool-bar';

export default function BloggerSearch() {
  const { bloggers } = useBloggersQuery();
  return (
    <>
      <SearchBar />
      {bloggers?.length > 0 && (
        <BloggersGrid bloggers={bloggers} upperChild={<ActionsToolBar />} />
      )}
    </>
  );
}
