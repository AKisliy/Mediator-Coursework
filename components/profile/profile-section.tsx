'use client';

import { History, Settings } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import SettingsDialog from './settings-dialog';

export default function ProfileSection() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { data: session } = useSession();

  const username = session?.user.username ?? session?.user.name;
  return (
    <div className="flex items-center justify-between mb-6 gap-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage
            src={session?.user.image}
            alt={username}
            key={session?.user.image}
          />
          <AvatarFallback>{username?.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold text-card-foreground">
            {username}
          </h1>
        </div>
      </div>
      <div className="flex gap-2">
        <Link href="/history">
          <Button variant="outline" size="icon">
            <History className="h-5 w-5 text-card-foreground" />
            <span className="sr-only">История</span>
          </Button>
        </Link>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSettingsOpen(true)}
        >
          <Settings className="h-5 w-5 text-card-foreground" />
          <span className="sr-only">Настройки</span>
        </Button>
        <SettingsDialog
          onClose={() => setIsSettingsOpen(false)}
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
        />
      </div>
    </div>
  );
}
