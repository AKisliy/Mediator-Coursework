import { getUserPlan } from '@/app/actions/plan';
import { getUserReccomendationsCount } from '@/app/actions/user';
import RecommendationsUsage from './recommendation-usage';

export async function RecommendationUsageWrapper() {
  const usages = await getUserReccomendationsCount();
  const plan = await getUserPlan();

  return (
    <RecommendationsUsage
      initialCount={usages ?? 0}
      initialLimit={plan?.monthly_limit ?? 0}
      initialPlan={plan?.name ?? 'Unknown'}
    />
  );
}
