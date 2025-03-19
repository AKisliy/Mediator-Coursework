'use client';

import { ReloadIcon } from '@radix-ui/react-icons';
import { DoorOpen, History, Settings } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IoPerson } from 'react-icons/io5';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { Button } from '../ui/button';

const dropDownLinks = [
  {
    title: 'Профиль',
    icon: IoPerson,
    href: '/profile'
  },
  {
    title: 'История запросов',
    icon: History,
    href: '/history'
  },
  {
    title: 'Настройки',
    icon: Settings,
    href: '/settings'
  },
  {
    title: 'Выйти',
    icon: DoorOpen,
    href: '/auth/signout'
  }
];

export default function UserProfileDropdown() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    setIsLoading(false);
  }, [status]);

  const pathName = usePathname();
  const isAuth =
    pathName.startsWith('/auth') || pathName.startsWith('/api/auth');

  if (isAuth) return null;

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
                  key={session?.user.image}
                />
                <AvatarFallback>
                  {session?.user?.name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{session?.user?.name}</DropdownMenuLabel>
            {dropDownLinks.map((value, idx) => (
              <div key={idx}>
                <DropdownMenuSeparator />
                <Button
                  className="flex flex-row text-base px-4 gap-3 items-center justify-start"
                  asChild
                  variant="ghost"
                >
                  <Link href={value.href}>
                    <value.icon size={20} />
                    {value.title}
                  </Link>
                </Button>
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
