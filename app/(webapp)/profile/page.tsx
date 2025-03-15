import ProfileSection from '@/components/profile/profile-section';
import UserLastSearch from '@/components/profile/user-last-search';
import UserPlan from '@/components/profile/user-plan';

export default function ProfilePage() {
  return (
    <div className="text-white p-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <ProfileSection />
        <UserLastSearch />
        <UserPlan />
      </div>
    </div>
  );
}
