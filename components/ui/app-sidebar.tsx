'use client';

import {
  Command,
  DoorOpen,
  History,
  PersonStandingIcon,
  Search,
  SparklesIcon
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';

import { dropDownLinks } from '../navigation/user-profile-dropdown';
import { NavUser } from './nav-user';

const sidebarLinks = [
  {
    titleKey: 'search',
    icon: Search,
    href: '/'
  },
  {
    titleKey: 'history',
    icon: History,
    href: '/history'
  },
  {
    titleKey: 'plans',
    icon: SparklesIcon,
    href: '/plans'
  }
];

export function AppSidebar() {
  const t = useTranslations('navigation.sidebar');

  const { data: session } = useSession();

  return (
    <Sidebar side="right">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary-foreground border border-solid border-sidebar-border text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Image
                    src="/logo.png"
                    alt="Mediator Logo"
                    width={14}
                    height={14}
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Mediator</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Mediator</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarLinks.map(item => (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton asChild>
                    <Link href={item.href}>
                      {item.icon && <item.icon />}
                      <span>{t(item.titleKey)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
