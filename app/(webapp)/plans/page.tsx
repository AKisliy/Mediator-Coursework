import PlanCard from '@/components/cards/plan-card';

export default function PlansPage() {
  return (
    <div className="flex flex-col gap-20 max-w-4xl w-full p-5 mt-20">
      <div className="grid grid-cols-3 gap-4 w-full">
        <PlanCard />
        <PlanCard />
        <PlanCard />
      </div>
    </div>
  );
}
