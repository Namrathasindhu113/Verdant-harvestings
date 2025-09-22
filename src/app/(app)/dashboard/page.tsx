import Link from 'next/link';
import {mockUser, mockHarvests} from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {ArrowUpRight, PlusCircle, Gift} from 'lucide-react';
import {HarvestCard} from '@/components/harvest-card';
import {AppHeader} from '@/components/app-header';

export default function DashboardPage() {
  const recentHarvests = mockHarvests.slice(0, 2);
  return (
    <>
      <AppHeader title="Dashboard" />
      <div className="p-4 sm:p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Welcome Back!</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-headline">{mockUser.name}</div>
              <p className="text-xs text-muted-foreground">
                Ready to log a new harvest?
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reward Points</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-headline text-accent">{mockUser.rewards.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
           <Card className="lg:col-span-1 bg-primary text-primary-foreground">
            <CardHeader>
                <CardTitle>Log a New Harvest</CardTitle>
                <CardDescription className="text-primary-foreground/80">Keep your records up to date and earn points.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild variant="secondary" className="w-full">
                    <Link href="/harvests/add"><PlusCircle className="mr-2 h-4 w-4" /> Add Harvest</Link>
                </Button>
            </CardContent>
           </Card>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold font-headline">Recent Harvests</h2>
            <Button asChild variant="link" className="text-accent hover:text-accent/80">
              <Link href="/harvests">
                View All <ArrowUpRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {recentHarvests.length > 0 ? (
              recentHarvests.map((harvest) => (
              <HarvestCard key={harvest.id} harvest={harvest} />
            ))
            ) : (
              <p className="text-muted-foreground">No recent harvests found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
