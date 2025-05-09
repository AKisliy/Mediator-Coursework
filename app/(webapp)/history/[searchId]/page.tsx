import { Clock } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';

import { getSearchWithBloggers } from '@/app/actions/data/history';
import BloggersGrid from '@/components/bloggers-grid/bloggers-grid';
import PageWithGridContainer from '@/components/container/page-with-grid-container';
import CsvButton from '@/components/search-block/toolbar/csv-button';
import { Separator } from '@/components/ui/separator';
import { formatTimestampToNow } from '@/lib/utils';

export default async function HistoryEntryPage({
  params
}: {
  params: { searchId: string };
}) {
  const t = await getTranslations('history.entry');
  const locale = await getLocale();
  const search = await getSearchWithBloggers(params.searchId);
  return (
    <div className="flex flex-col gap-20 min-w-5xl p-5">
      <PageWithGridContainer>
        <div className="flex flex-col">
          <div className="flex flex-col flex-grow gap-4">
            <div className="text-base text-gray-300">{t('yourRequest')}</div>
            <div className="text-3xl">{search?.query}</div>
            <div className="flex flex-row gap-1 items-center text-sm text-gray-300">
              <Clock className="size-4" />
              {formatTimestampToNow(search?.createdAt, locale)}
            </div>
          </div>
          <Separator className="my-6" />
          <div className="flex flex-row items-center text-center justify-between mb-4">
            <div className="text-xl text-gray-300 h-full">{t('result')}</div>
            <CsvButton
              iconStyle="w-16 h-16 cursor-pointer transition-all duration-300 ease-in-out"
              bloggers={search?.bloggers ?? []}
              includeText
            />
          </div>
          <BloggersGrid
            bloggers={search?.bloggers ?? []}
            config={{ needReasonButton: false }}
          />
        </div>
      </PageWithGridContainer>
    </div>
  );
}
