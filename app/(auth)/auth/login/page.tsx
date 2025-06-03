import AccountDeletedDialog from '@/components/auth/account-deleted-dialog';
import { LoginForm } from '@/components/auth/login-form';
import SessionExpiredDialog from '@/components/auth/session-expired-dialog';

export default function LoginPage() {
  return (
    <>
      <LoginForm />
      <AccountDeletedDialog />
      <SessionExpiredDialog />
    </>
  );
}
