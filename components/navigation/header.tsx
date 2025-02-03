'use client';

import '../../app/globals.css';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import RecommendationsUsage from './recommendation-usage';
import { ThemeSwitcher } from '../theme-switcher';

export default function Header() {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-6xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <Link
            href="\home"
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#9333EA] to-[#EC4899] transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Mediator
          </Link>
          <RecommendationsUsage />
        </div>
        <div className="flex gap-5 items-center">
          <Button variant="outline" asChild>
            <a
              href="https://t.me/collabguru"
              target="_blank"
              rel="noopener noreferrer"
            >
              Связаться
            </a>
          </Button>
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
}
