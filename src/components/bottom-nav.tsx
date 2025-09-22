'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {Award, Home, Leaf, PlusCircle} from 'lucide-react';
import {cn} from '@/lib/utils';

const navItems = [
  {href: '/dashboard', label: 'Home', icon: Home},
  {href: '/harvests', label: 'Harvests', icon: Leaf},
  {href: '/harvests/add', label: 'Add', icon: PlusCircle, isCentral: true},
  {href: '/rewards', label: 'Rewards', icon: Award},
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur-sm md:hidden">
      <div className="grid grid-cols-4 h-16 items-center">
        {navItems.map(({href, label, icon: Icon, isCentral}) => {
          // Special check for Add Harvest
          if (href === '/harvests/add') return null;
          const isActive = pathname.startsWith(href) && (href !== '/dashboard' || pathname === '/dashboard');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 text-sm font-medium h-full',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs">{label}</span>
            </Link>
          );
        })}
      </div>
       <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
            <Link
                href="/harvests/add"
                className="relative flex h-16 w-16 flex-col items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105"
              >
                <PlusCircle className="h-8 w-8" />
                <span className="sr-only">Add Harvest</span>
            </Link>
       </div>
    </nav>
  );
}
