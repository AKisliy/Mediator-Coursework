'use client';

import '../../app/globals.css';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathName = usePathname();
  const isHomePage = pathName === '/home' || pathName === '/base';

  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-6xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          {/* bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 transition-all duration-300 ease-in-out transform hover:scale-105 */}
          <Link
            href="\home"
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#9333EA] to-[#EC4899] transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Mediator
          </Link>
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
        </div>
      </div>
    </nav>
  );
}
