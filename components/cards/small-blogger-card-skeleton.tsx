import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';

export default function SmallBloggerCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="flex justify-between">
          <div className="flex items-center space-x-4">
            <Avatar>
              <Skeleton className="w-10 h-10 rounded-full" />
            </Avatar>
            <div>
              <Skeleton className="h-5 w-24 mb-1" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-6 w-6" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-3/4 mb-2" />
      </CardContent>
    </Card>
  );
}
