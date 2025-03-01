import { Skeleton } from '../../ui/skeleton';

export default function RecommendationFallback() {
  return (
    <div className="flex items-center justify-center h-16">
      <Skeleton className="w-60 h-10" />
    </div>
  );
}
