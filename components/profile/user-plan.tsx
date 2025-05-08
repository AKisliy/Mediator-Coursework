import { ChevronRight, Crown } from 'lucide-react';
import Link from 'next/link';

import { getUserPlanWithPurchaseDate } from '@/app/actions/data/plan';
import { formatDate } from '@/lib/utils';

import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default async function UserPlan() {
  const planWithPurchaseDate = await getUserPlanWithPurchaseDate();
  const isHighestPlan =
    planWithPurchaseDate?.plan.id === Number(process.env.HIGHEST_TIER_PLAN_ID);
  return (
    <Card className="bg-zinc-900 border-zinc-800 w-full">
      <CardHeader>
        <div className="flex items-center justify-between gap-6">
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-purple-500" />
            Текущий тариф
          </CardTitle>
          <Button asChild>
            <Link href="/plans">
              {isHighestPlan ? 'Тарифы' : 'Улучшить'}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <p className="font-medium">{planWithPurchaseDate?.plan.name}</p>
          <p className="text-sm text-gray-400">
            Дата приобретения:{' '}
            {planWithPurchaseDate
              ? formatDate(planWithPurchaseDate.planPurchase)
              : 'Неизвестно'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
