
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar, MapPin, Weight, ChevronLeft, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Harvest } from '@/lib/types';
import { mockHarvests } from '@/lib/data';
import { format } from 'date-fns';
import { useLocalization } from '@/context/localization-context';
import { Skeleton } from '@/components/ui/skeleton';

export default function HarvestDetailPage() {
  const { t } = useLocalization();
  const params = useParams();
  const id = params.id as string;
  const [harvest, setHarvest] = useState<Harvest | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This effect runs only on the client, ensuring localStorage is available.
    if (id) {
      const storedHarvests = JSON.parse(localStorage.getItem('harvests') || '[]');
      const allHarvests = [...mockHarvests, ...storedHarvests];
      // By placing storedHarvests last, any user-saved harvest will overwrite the initial mock harvest.
      const uniqueHarvestsMap = new Map(allHarvests.map(h => [h.id, h]));
      const foundHarvest = uniqueHarvestsMap.get(id) || null;
      setHarvest(foundHarvest);
      setIsLoading(false);
    }
  }, [id]);

  return (
    <>
      <AppHeader title={harvest ? t(harvest.herbName) : t('Harvest Details')} />
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
            <Button asChild variant="outline" size="sm">
                <Link href="/harvests">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    {t('Back to All Harvests')}
                </Link>
            </Button>
            {harvest && (
                <Button asChild size="sm">
                    <Link href={`/harvests/${harvest.id}/edit`}>
                        <Pencil className="mr-2 h-4 w-4" />
                        {t('Edit Harvest')}
                    </Link>
                </Button>
            )}
        </div>

        {isLoading ? (
            <Card>
                <Skeleton className="h-64 w-full rounded-t-lg" />
                <CardHeader>
                    <Skeleton className="h-8 w-2/3" />
                    <Skeleton className="h-4 w-1/3" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-6 w-1/2" />
                </CardContent>
            </Card>
        ) : harvest ? (
          <Card className="overflow-hidden shadow-lg">
            <div className="relative h-64 w-full">
              <Image
                src={harvest.photoUrl}
                alt={`Photo of ${harvest.herbName}`}
                fill
                style={{ objectFit: 'cover' }}
                data-ai-hint={harvest.photoHint}
                className="bg-muted"
                priority
              />
            </div>
            <CardHeader>
              <CardTitle className="text-3xl font-bold font-headline">{t(harvest.herbName)}</CardTitle>
              <CardDescription className="flex items-center gap-2 pt-2 text-base">
                <Calendar className="h-5 w-5" />
                <span>{t('Harvested on')} {format(new Date(harvest.date), 'MMMM d, yyyy')}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-lg">
              <div className="flex items-center gap-3">
                <Weight className="h-6 w-6 text-primary" />
                <span className="font-semibold">{t('Quantity')}:</span>
                <span>{harvest.quantity} {t(harvest.unit)}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-6 w-6 text-primary" />
                <span className="font-semibold">{t('Location')}:</span>
                <span>{harvest.gps.lat.toFixed(4)}, {harvest.gps.lon.toFixed(4)}</span>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">{t('Harvest Not Found')}</h2>
            <p className="text-muted-foreground">
              {t("We couldn't find the harvest you're looking for.")}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
