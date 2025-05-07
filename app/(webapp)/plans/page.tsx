import { getAllPlans, getUserPlan } from '@/app/actions/data/plan';
import PlanCard from '@/components/cards/plan-card';

export default async function PlansPage() {
  const plans = await getAllPlans();
  const currentUserPlan = await getUserPlan();
  return (
    <div className="grid grid-rows-3 md:grid-cols-3 md:grid-rows-1 gap-4 w-full max-w-4xl p-5 md:mt-20">
      {plans?.map(plan => (
        <PlanCard
          key={plan.id}
          plan={plan}
          currentPlanId={currentUserPlan?.id}
        />
      ))}
    </div>
  );
}
