import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export default function ProfileInfo() {
  //   const { session } = useSupabaseSession();
  //   const userEmail = session?.user?.email;
  const avatarFallback = 'UNKN'[0].toUpperCase();

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={''} />
        <AvatarFallback>{avatarFallback}</AvatarFallback>
      </Avatar>
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">{'myEmail'}</h2>
        {/* <LogoutButton /> */}
      </div>
    </div>
  );
}
