import { Check } from 'lucide-react';
import React from 'react';

import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle
} from '../ui/card';

export default function PlanCard() {
  const points = [
    'Первая неделя бесплатно',
    'Профессиональная озвучка и ИИ аватары',
    '50+ готовых видео в месяц для Instagram, TikTok, YouTube в формате 9:16',
    '10-90 секунд продолжительность видео'
  ];
  return (
    <Card>
      <CardTitle className="p-4">Лучший план</CardTitle>
      <CardDescription className="px-4 py-1">Крутое описание.</CardDescription>
      <CardContent>
        <div className="flex flex-col gap-1 mb-8 text-sm">
          {points.map((point, idx) => (
            <div key={idx} className="flex flex-row gap-2 items-start">
              <Check size={16} className="mt-1" />
              <span className="w-fit leading-7">{point}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button>Приобрести</Button>
      </CardFooter>
    </Card>
  );
}
