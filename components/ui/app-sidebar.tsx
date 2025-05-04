import { PersonStandingIcon } from 'lucide-react';

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

const links = [
  {
    title: 'Some stuff',
    url: '/profile',
    icon: PersonStandingIcon
  }
];

export function AppSidebar() {
  return (
    <Sidebar side="right">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Amplify</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="text-sm text-gray-400 p-4">© 2025 Amplify</div>
      </SidebarFooter>
    </Sidebar>
  );
}
