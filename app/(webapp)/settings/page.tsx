'use client';

import ProfileInfo from '@/components/settings/profile-info';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <div className="container items-center justify-center mx-auto md:py-10 md:w-2/3">
      <Card className="rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle>Настройки</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileInfo />
        </CardContent>
      </Card>
    </div>
  );
}
