import { Suspense } from 'react';

import ProfileSection from '@/components/profile/profile-section';
import UserLastSearch from '@/components/profile/user-last-search';
import UserProfileSearchFallback from '@/components/profile/user-last-search-fallback';
import UserPlan from '@/components/profile/user-plan';
import UserPlanFallback from '@/components/profile/user-plan-fallback';

export default function ProfilePage() {
  return (
    <div className="text-white p-4 mt-20">
      <div className="max-w-3xl mx-auto space-y-6">
        <ProfileSection />
        <Suspense fallback={<UserProfileSearchFallback />}>
          <UserLastSearch />
        </Suspense>
        <Suspense fallback={<UserPlanFallback />}>
          <UserPlan />
        </Suspense>
      </div>
    </div>
  );
}
