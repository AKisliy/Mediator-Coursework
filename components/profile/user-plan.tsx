import { ChevronRight, Crown } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import { getUserPlanWithPurchaseDate } from '@/app/actions/data/plan';
import { formatDate } from '@/lib/utils';

import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default async function UserPlan() {
  const t = await getTranslations('profile');
  const planWithPurchaseDate = await getUserPlanWithPurchaseDate();
  const isHighestPlan =
    planWithPurchaseDate?.plan.id === Number(process.env.HIGHEST_TIER_PLAN_ID);
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between gap-6">
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-purple-500" />
            {t('currentPlan')}
          </CardTitle>
          <Button asChild>
            <Link href="/plans">
              {isHighestPlan ? t('plansButton') : t('upgradePlanButton')}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <p className="font-medium">{planWithPurchaseDate?.plan.name}</p>
          <p className="text-sm text-gray-400">
            {t('purchaseDate')}:{' '}
            {planWithPurchaseDate
              ? formatDate(planWithPurchaseDate.planPurchase)
              : t('unknownPurchaseDate')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
