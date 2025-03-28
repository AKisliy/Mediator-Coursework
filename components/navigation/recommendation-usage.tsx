'use client';

import { usePathname } from 'next/navigation';

import { Skeleton } from '@/components/ui/skeleton';
import { useRecommendation } from '@/context/recommendations-provider';

import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Progress } from '../ui/progress';

export default function RecommendationsUsage() {
  const { recommendationCount, recommendationLimit, planName, isLoading } =
    useRecommendation();

  const percentage = ((recommendationCount * 1.0) / recommendationLimit) * 100;
  const path = usePathname();
  const isAuth = path.startsWith('/auth') || path.startsWith('/api/auth');

  if (isAuth) return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-16">
        <Skeleton className="w-32 h-10" />
      </div>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="mr-2 relative pl-7">
          {recommendationCount > 0 ? (
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full" />
          ) : (
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full" />
          )}
          Рекомендаций: {recommendationCount}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-medium leading-none">Ваш тариф: {planName}</h4>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{recommendationCount}</span>
            <span>{recommendationLimit}</span>
          </div>
          <Progress value={percentage} className="h-2" />
          <p className="text-xs text-muted-foreground pt-2">
            {(100 - percentage).toFixed(1)}% доступных рекомендаций
            использовано.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
