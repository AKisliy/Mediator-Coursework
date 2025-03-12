import { cn } from '@/lib/utils';
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
  children,
  ...props
}: {
  title: string;
  description: string;
} & React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn('flex flex-col gap-6 max-w-lg w-full', className)}
      {...props}
    >
      <Card>
        <CardHeader className="text-center pb-0 pt-8">
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription className="text-balance text-muted-foreground">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
