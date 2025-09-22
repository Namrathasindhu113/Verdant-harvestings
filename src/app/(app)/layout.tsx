import { BottomNav } from '@/components/bottom-nav';
import { SidebarNav } from '@/components/sidebar-nav';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <SidebarNav />
      <div className="flex flex-1 flex-col">
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
