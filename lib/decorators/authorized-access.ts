import { getSession } from 'next-auth/react';
import { MOCK_USER_ID } from '../mock/config';

export function AuthorizedAccess(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    const userId = await getUserId();
    // добавить в тело или url полученный id
    const result = await originalMethod.apply(this, args);
    return result;
  };

  return descriptor;
}

async function getUserId() {
  if (process.env.NEXT_PUBLIC_USE_MOCK_USER === 'true') {
    return MOCK_USER_ID;
  }

  const session = await getSession();

  if (!session) {
    throw new Error('Пользователь не авторизован');
  }

  return session.user.id;
}
