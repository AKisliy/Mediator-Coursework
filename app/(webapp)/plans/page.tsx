import { getAllPlans, getUserPlan } from '@/app/actions/data/plan';
import PlanCard from '@/components/cards/plan-card';

export default async function PlansPage() {
  const plans = await getAllPlans();
  const currentUserPlan = await getUserPlan();
  return (
    <div className="flex flex-grow h-full w-full items-center justify-center">
      <div className="grid grid-rows-3 md:grid-cols-3 md:grid-rows-1 gap-4 w-full h-fit max-w-4xl p-5 md:scale-125">
        {plans?.map(plan => (
          <PlanCard
            key={plan.id}
            plan={plan}
            currentPlanId={currentUserPlan?.id}
          />
        ))}
      </div>
    </div>
  );
}
