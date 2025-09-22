'use client';

import { AppHeader } from '@/components/app-header';
import { RewardsRecommendations } from '@/components/rewards-recommendations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockUser, mockHarvests } from '@/lib/data';
import { Gift } from 'lucide-react';
import { useLocalization } from '@/context/localization-context';

export default function RewardsPage() {
    const { t } = useLocalization();
    const recentHarvestsCount = mockHarvests.length;
    const totalQuantity = mockHarvests.reduce((sum, h) => sum + h.quantity, 0);
    const averageQuantityPerHarvest = recentHarvestsCount > 0 ? totalQuantity / recentHarvestsCount : 0;

  return (
    <>
      <AppHeader title="My Rewards" />
      <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
        <Card className="text-center shadow-lg">
            <CardHeader>
                <div className="mx-auto bg-accent/10 rounded-full p-4 w-fit">
                    <Gift className="h-10 w-10 text-accent" />
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{t('Your Rewards Balance')}</p>
                <h2 className="text-5xl font-bold font-headline text-accent">{mockUser.rewards.toLocaleString()} PTS</h2>
                <p className="text-muted-foreground pt-2">{t('Keep up the great work!')}</p>
            </CardContent>
        </Card>
        
        <RewardsRecommendations
          recentHarvestsCount={recentHarvestsCount}
          averageQuantityPerHarvest={averageQuantityPerHarvest}
          rewardsBalance={mockUser.rewards}
        />
      </div>
    </>
  );
}
