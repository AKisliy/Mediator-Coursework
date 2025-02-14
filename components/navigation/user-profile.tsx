import { auth } from '@/app/api/auth/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export default async function UserAvatar() {
  const session = await auth();
  return (
    <Avatar>
      <AvatarImage
        src={session?.user?.image ?? '/default.webp'}
        alt="@shadcn"
      />
      <AvatarFallback>{session?.user?.name}</AvatarFallback>
    </Avatar>
  );
}
