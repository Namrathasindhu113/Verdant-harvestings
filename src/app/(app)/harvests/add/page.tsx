import { AppHeader } from '@/components/app-header';
import { AddHarvestForm } from '@/components/add-harvest-form';

export default function AddHarvestPage() {
  return (
    <>
      <AppHeader title="Add Harvest" />
      <div className="p-4 sm:p-6 max-w-2xl mx-auto">
        <AddHarvestForm />
      </div>
    </>
  );
}
