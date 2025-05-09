import { Separator } from '../ui/separator';
import { TabsContent } from '../ui/tabs';
import ChangePasswordForm from './change-password-form';
import DeletionAlert from './deletion-alert';

export default function SecurityTabContent() {
  return (
    <TabsContent value="security" className="space-y-4">
      <ChangePasswordForm />
      <Separator className="my-4" />

      <DeletionAlert />
    </TabsContent>
  );
}
