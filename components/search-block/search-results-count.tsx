'use client';

import React from 'react';

import { useRecommendation } from '@/context/recommendations-provider';

import RecommendationCountInput from './recommendation-count';

export default function SearchResultsCount() {
  const { recommendationCount } = useRecommendation();
  return (
    <div className="flex justify-end">
      <RecommendationCountInput countLimit={recommendationCount} />{' '}
    </div>
  );
}
