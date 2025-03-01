'use client';

import { getUserPlan } from '@/app/actions/plan';
import { getUserReccomendationsCount } from '@/app/actions/user';
import React, { createContext, useContext, useEffect, useState } from 'react';

type RecommendationContextType = {
  recommendationCount: number;
  setRecommendationCount: (n: number) => void;
  setPlanName: (planName: string) => void;
  setRecommendationLimit: (limit: number) => void;
  recommendationLimit: number;
  planName: string;
};

const RecommendationContext = createContext<
  RecommendationContextType | undefined
>(undefined);

export const RecommendationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [recommendationCount, setRecommendationCount] = useState(0);
  const [recommendationLimit, setRecommendationLimit] = useState(0);
  const [planName, setPlanName] = useState('');

  useEffect(() => {
    const fetchRecommendationCount = async () => {
      try {
        const usages = await getUserReccomendationsCount();
        const plan = await getUserPlan();
        setRecommendationCount(usages ?? 0);
        setRecommendationLimit(plan?.monthly_limit ?? 0);
        setPlanName(plan?.name ?? 'Unknown');
      } catch (error) {
        console.error('Ошибка при загрузке recommendationCount:', error);
      }
    };

    fetchRecommendationCount();
  }, []);

  return (
    <RecommendationContext.Provider
      value={{
        recommendationCount,
        setRecommendationCount,
        recommendationLimit,
        planName,
        setPlanName,
        setRecommendationLimit
      }}
    >
      {children}
    </RecommendationContext.Provider>
  );
};

export const useRecommendation = () => {
  const context = useContext(RecommendationContext);
  if (context === undefined) {
    throw new Error(
      'useRecommendation должен использоваться внутри RecommendationProvider'
    );
  }
  return context;
};
