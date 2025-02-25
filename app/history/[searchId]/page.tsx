import { getSearchWithBloggers } from '@/app/actions/search-history';
import PageWithGridContainer from '@/components/container/page-with-grid-container';
import BloggersGrid from '@/components/search-main-block/bloggers-grid';
import { Separator } from '@/components/ui/separator';
import { formatTimestamp } from '@/lib/utils';
import { Clock } from 'lucide-react';

export default async function HistoryEntryPage({
  params
}: {
  params: { searchId: string };
}) {
  const search = await getSearchWithBloggers(params.searchId);
  return (
    <div className="flex flex-col gap-20 min-w-5xl p-5">
      <PageWithGridContainer>
        <div className="flex flex-col items-start">
          <div className="flex flex-col flex-grow gap-4">
            <div className="text-base text-gray-300">Ваш запрос:</div>
            <div className="text-3xl">{search?.query}</div>
            <div className="flex flex-row gap-1 items-center text-sm text-gray-300">
              <Clock className="size-4" />
              {formatTimestamp(search?.createdAt)}
            </div>
          </div>
          <Separator className="my-6" />
          <div className="text-xl text-gray-300 mb-4">🚀 Результат:</div>
          <BloggersGrid
            bloggers={search?.bloggers ?? []}
            config={{ needReasonButton: false }}
          />
        </div>
      </PageWithGridContainer>
    </div>
  );
}
