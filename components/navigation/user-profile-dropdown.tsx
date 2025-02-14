'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ReloadIcon } from '@radix-ui/react-icons';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function UserProfileDropdown() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    setIsLoading(false);
  }, [status]);

  return (
    <>
      {isLoading && <ReloadIcon className="h-6 w-6 animate-spin" />}
      {!isLoading && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div>
              <Avatar>
                <AvatarImage
                  src={session?.user?.image ?? '/default.webp'}
                  alt="@shadcn"
                />
                <AvatarFallback>{session?.user?.name}</AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{session?.user?.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
