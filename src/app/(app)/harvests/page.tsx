
'use client';

import { mockHarvests as initialHarvests } from '@/lib/data';
import { HarvestCard } from '@/components/harvest-card';
import { AppHeader } from '@/components/app-header';
import { useLocalization } from '@/context/localization-context';
import { useEffect, useState } from 'react';
import { Harvest } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export default function HarvestsPage() {
  const { t } = useLocalization();
  const [allHarvests, setAllHarvests] = useState<Harvest[]>([]);

  useEffect(() => {
    // This effect runs only on the client, ensuring localStorage is available.
    const storedHarvests = JSON.parse(localStorage.getItem('harvests') || '[]');
    const combinedHarvests = [...storedHarvests, ...initialHarvests];

    // Create a Map to ensure harvests are unique by ID.
    // The map constructor will automatically handle deduplication, keeping the first
    // entry it sees for a given key. Since storedHarvests comes first, it takes precedence.
    const uniqueHarvestsMap = new Map(combinedHarvests.map(h => [h.id, h]));
    const uniqueHarvests = Array.from(uniqueHarvestsMap.values());

    // Sort by date, most recent first
    uniqueHarvests.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setAllHarvests(uniqueHarvests);
  }, []);

  return (
    <>
      <AppHeader title="My Harvests" />
      <div className="p-4 sm:p-6">
        {allHarvests.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {allHarvests.map((harvest) => (
              <HarvestCard key={harvest.id} harvest={harvest} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">{t('No Harvests Yet')}</h2>
            <p className="text-muted-foreground mb-4">
              {t("You haven't logged any harvests. Start by adding one!")}
            </p>
            <Button asChild>
              <Link href="/harvests/add">
                <PlusCircle className="mr-2 h-4 w-4" />
                {t('Add First Harvest')}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
