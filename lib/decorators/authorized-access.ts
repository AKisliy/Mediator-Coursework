export function AuthorizedAccess(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    const userId = await checkUserSession();
    // добавить в тело или url полученный id
    const result = await originalMethod.apply(this, args);
    return result;
  };

  return descriptor;
}

async function checkUserSession() {
  const session = null; // как-то проверять

  if (!session && process.env.NEXT_PUBLIC_USE_MOCK_USER !== 'true') {
    throw new Error('Пользователь не авторизован');
  }
}
