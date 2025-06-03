'use client';

import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { ReloadIcon } from '@radix-ui/react-icons';
import { DoorOpen, History, Settings } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
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

import SettingsDialog from '../profile/settings-dialog';
import { Button } from '../ui/button';

export const dropDownLinks = [
  {
    titleKey: 'profile',
    icon: IoPerson,
    href: '/profile'
  },
  {
    titleKey: 'history',
    icon: History,
    href: '/history'
  },
  {
    titleKey: 'logout',
    icon: DoorOpen,
    href: '/auth/signout'
  }
];

export default function UserProfileDropdown() {
  const t = useTranslations('navigation.dropdown');
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSettingsOpened, setIsSettingsOpened] = useState(false);

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
        <DropdownMenu modal={false}>
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
            <DropdownMenuLabel className="flex flex-row w-full justify-between items-center">
              {session?.user?.name}
              <Button
                onClick={e => {
                  e.preventDefault();
                  setIsSettingsOpened(true);
                }}
                variant="ghost"
                className="p-1 h-fit hvr-icon-grow-rotate hover:bg-transparent"
              >
                <Settings className="hvr-icon" />
              </Button>
            </DropdownMenuLabel>
            {dropDownLinks.map((value, idx) => (
              <DropdownMenuItem onSelect={e => e.preventDefault()} key={idx}>
                <DropdownMenuSeparator />
                <Button
                  className="hvr-icon-rotate flex flex-row text-base px-4 gap-3 items-center justify-start w-full "
                  asChild
                  variant="ghost"
                >
                  <Link href={value.href}>
                    <value.icon size={20} className="hvr-icon" />
                    {t(value.titleKey)}
                  </Link>
                </Button>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <SettingsDialog
        isSettingsOpen={isSettingsOpened}
        setIsSettingsOpen={setIsSettingsOpened}
        onClose={() => setIsSettingsOpened(false)}
      />
    </>
  );
}
