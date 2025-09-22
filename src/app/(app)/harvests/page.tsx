'use client';

import { mockHarvests } from '@/lib/data';
import { HarvestCard } from '@/components/harvest-card';
import { AppHeader } from '@/components/app-header';
import { useLocalization } from '@/context/localization-context';

export default function HarvestsPage() {
  const { t } = useLocalization();
  return (
    <>
      <AppHeader title="My Harvests" />
      <div className="p-4 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mockHarvests.map((harvest) => (
            <HarvestCard key={harvest.id} harvest={harvest} />
          ))}
        </div>
      </div>
    </>
  );
}
