'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';

import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../ui/card';

export default function CardWrapper({
  title,
  description,
  className,
  includeBackButton,
  children,
  ...props
}: {
  title: string;
  description: string;
  includeBackButton?: boolean;
} & React.ComponentPropsWithoutRef<'div'>) {
  const router = useRouter();
  return (
    <div
      className={cn('flex flex-col gap-6 max-w-lg w-full', className)}
      {...props}
    >
      <Card className="relative">
        <CardHeader className="text-center pb-0 pt-8">
          <CardTitle className="text-xl md:text-2xl flex items-center justify-between">
            {includeBackButton && (
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="absolute left-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <span className="w-full text-center">{title}</span>
          </CardTitle>
          <CardDescription className="text-balance text-muted-foreground">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm md:text-base min-h-36">
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
