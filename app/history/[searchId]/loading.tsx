import BloggersGridSkeleton from '@/components/bloggers-grid-skeleton';
import PageWithGridContainer from '@/components/container/page-with-grid-container';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col gap-20 min-w-5xl p-5">
      <PageWithGridContainer>
        <div className="flex flex-col items-start">
          <div className="flex flex-col flex-grow gap-4">
            <div className="text-base text-gray-300">Ваш запрос:</div>
            <div className="text-3xl">
              <Skeleton className="w-full h-10" />
            </div>
            <div className="flex flex-row gap-1 items-center text-sm text-gray-300">
              <Clock className="size-4" />
              <Skeleton className="w-24 h-5" />
            </div>
          </div>
          <Separator className="my-6" />
          <div className="text-xl text-gray-300 mb-4">🚀 Результат:</div>
          <BloggersGridSkeleton />
        </div>
      </PageWithGridContainer>
    </div>
  );
}
