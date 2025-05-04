import { Button } from '@/components/ui/button';
import React from 'react';

export default function ProviderButton({
  icon,
  hiddenText
}: {
  icon: React.ReactNode;
  hiddenText: string;
}) {
  return (
    <Button variant="outline" type="button" className="w-full">
      {icon}
      <span className="sr-only">{hiddenText}</span>
    </Button>
  );
}
