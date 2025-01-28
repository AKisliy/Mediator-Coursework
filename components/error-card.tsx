import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function ErrorCard({ error }: { error: string }) {
  return (
    <Card className="mb-8 bg-red-50 border-red-200">
      <CardHeader />
      <CardContent>
        <p className="text-red-700">{error}</p>
      </CardContent>
    </Card>
  );
}
