'use client';

import { recommendRewardsActions } from '@/ai/flows/recommend-rewards-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useTransition } from 'react';
import { Lightbulb, Loader2, Sparkles } from 'lucide-react';
import { useLocalization } from '@/context/localization-context';

type Props = {
  recentHarvestsCount: number;
  averageQuantityPerHarvest: number;
  rewardsBalance: number;
};

export function RewardsRecommendations({
  recentHarvestsCount,
  averageQuantityPerHarvest,
  rewardsBalance,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLocalization();

  const handleGetRecommendations = () => {
    startTransition(async () => {
      setError(null);
      setRecommendations([]);
      try {
        const result = await recommendRewardsActions({
          recentHarvestsCount,
          averageQuantityPerHarvest,
          rewardsBalance,
        });
        setRecommendations(result.recommendedActions);
      } catch (e) {
        console.error(e);
        setError(t('Could not get recommendations at this time.'));
      }
    });
  };

  return (
    <Card className="bg-accent/10 border-accent/30 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Sparkles className="text-accent" />
          {t('Boost Your Points')}
        </CardTitle>
        <CardDescription>
          {t('Get AI-powered tips on how to earn more rewards.')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 && !isPending ? (
          <div className="flex flex-col items-center justify-center text-center space-y-4 p-4">
             <p className="text-sm text-muted-foreground">{t('Click the button to get personalized recommendations.')}</p>
             <Button onClick={handleGetRecommendations} disabled={isPending}>
                <Sparkles className="mr-2 h-4 w-4" />
              {t('Get Recommendations')}
            </Button>
          </div>
        ) : isPending ? (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
        ) : (
            <div className="space-y-3">
                <ul className="list-none space-y-3">
                {recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <div className="mt-1 flex-shrink-0">
                            <Lightbulb className="h-5 w-5 text-accent" />
                        </div>
                        <span className="text-sm text-foreground">{rec}</span>
                    </li>
                ))}
                </ul>
                <Button variant="link" onClick={handleGetRecommendations} disabled={isPending} className="text-accent p-0 h-auto">
                    {t('Get new recommendations')}
                </Button>
            </div>
        )}
        {error && <p className="text-sm text-destructive mt-4">{error}</p>}
      </CardContent>
    </Card>
  );
}
