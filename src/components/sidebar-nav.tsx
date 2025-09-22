'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {Award, Home, Leaf, PlusCircle, LogOut} from 'lucide-react';
import {cn} from '@/lib/utils';
import {Button} from '@/components/ui/button';

const navItems = [
  {href: '/dashboard', label: 'Dashboard', icon: Home},
  {href: '/harvests', label: 'My Harvests', icon: Leaf},
  {href: '/rewards', label: 'Rewards', icon: Award},
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex md:flex-col md:w-64 md:border-r md:bg-card/80">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold font-headline text-primary">
          <Leaf />
          <span>Verdant Harvests</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <div className="px-4 py-2">
          <Button asChild className="w-full">
            <Link href="/harvests/add">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Harvest
            </Link>
          </Button>
        </div>
        <ul className="space-y-1 px-4 mt-4">
          {navItems.map(({href, label, icon: Icon}) => {
            const isActive = pathname.startsWith(href) && (href !== '/dashboard' || pathname === '/dashboard');
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-accent/20',
                    isActive && 'bg-accent/80 text-accent-foreground hover:bg-accent/90 hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="mt-auto border-t p-4">
        <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
            </Link>
        </Button>
      </div>
    </nav>
  );
}
