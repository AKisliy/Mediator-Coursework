'use client';

import { Laptop, Moon, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useCookieSettings } from '@/hooks/use-cookie-settings';

const ThemeSwitcher = () => {
  const t = useTranslations('settings.preferenceTab');
  const [mounted, setMounted] = useState(false);
  const { changeTheme, theme } = useCookieSettings();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const ICON_SIZE = 16;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={'sm'}>
          {theme === 'light' && (
            <Sun
              key="light"
              size={ICON_SIZE}
              className={'text-muted-foreground'}
            />
          )}
          {theme === 'dark' && (
            <Moon
              key="dark"
              size={ICON_SIZE}
              className={'text-muted-foreground'}
            />
          )}
          {theme === 'system' && (
            <Laptop
              key="system"
              size={ICON_SIZE}
              className={'text-muted-foreground'}
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-content" align="start">
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={e => changeTheme(e)}
        >
          <DropdownMenuRadioItem className="flex gap-2" value="light">
            <Sun size={ICON_SIZE} className="text-muted-foreground" />{' '}
            <span>{t('themeLight')}</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="flex gap-2" value="dark">
            <Moon size={ICON_SIZE} className="text-muted-foreground" />{' '}
            <span>{t('themeDark')}</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="flex gap-2" value="system">
            <Laptop size={ICON_SIZE} className="text-muted-foreground" />{' '}
            <span>{t('themeSystem')}</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { ThemeSwitcher };
