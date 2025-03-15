import { getUserPlanWithPurchaseDate } from '@/data/plan';
import { formatDate } from '@/lib/utils';
import { ChevronRight, Crown } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default async function UserPlan() {
  const planWithPurchaseDate = await getUserPlanWithPurchaseDate();
  return (
    <Card className="bg-zinc-900 border-zinc-800 w-full">
      <CardHeader>
        <div className="flex items-center justify-between gap-6">
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-purple-500" />
            Текущий тариф
          </CardTitle>
          {planWithPurchaseDate?.plan.id !==
            process.env.HIGHEST_TIER_PLAN_ID && (
            <Link href="/plans">
              <Button>
                Улучшить
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <p className="font-medium">{planWithPurchaseDate?.plan.name}</p>
          <p className="text-sm text-gray-400">
            Дата приобретения: {formatDate(planWithPurchaseDate?.planPurchase)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
