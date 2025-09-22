
'use client';

import { AppHeader } from '@/components/app-header';
import { EditHarvestForm } from '@/components/edit-harvest-form';
import { useLocalization } from '@/context/localization-context';

export default function EditHarvestPage() {
  const { t } = useLocalization();
  return (
    <>
      <AppHeader title={t('Edit Harvest')} />
      <div className="p-4 sm:p-6 max-w-2xl mx-auto">
        <EditHarvestForm />
      </div>
    </>
  );
}
