import { Check } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { Plan } from '@/types/plan';

import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../ui/card';

export default function PlanCard({ plan }: { plan: Plan }) {
  const isPopluarPlan =
    plan.id === Number(process.env.NEXT_PUBLIC_POPULAR_PLAN_ID);
  return (
    <Card
      className={`flex flex-col min-h-full ${isPopluarPlan && 'border-green-700 bg-green-300 bg-opacity-10 md:scale-110'}`}
    >
      <CardHeader className="gap-3">
        <CardTitle className="flex flex-row items-center gap-2">
          {plan.name}
          {isPopluarPlan && (
            <div className="text-xs text-green-700 font-semibold ml-2 border-solid border-2 border-green-700 rounded-md px-2 py-1">
              Популярный
            </div>
          )}
        </CardTitle>
        <CardDescription className="text-base text-foreground">
          {plan.description}
        </CardDescription>
        <Button asChild>
          <Link href={process.env.NEXT_PUBLIC_OWNER_TG}>Приобрести</Link>
        </Button>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-col gap-1 mb-8 text-sm">
          {plan?.planFeatures.map((point, idx) => (
            <div key={idx} className="flex flex-row gap-2 items-start">
              <Check size={16} className="mt-1" />
              <span className="w-fit leading-7">{point}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
