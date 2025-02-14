'use client';

import { LoginForm } from '@/components/auth/login-form';
import LoginLayout from '@/components/layout/login-layout';

export default function Weclome() {
  return (
    <LoginLayout>
      <LoginForm />
    </LoginLayout>
  );
}
