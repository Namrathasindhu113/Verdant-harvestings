
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, Upload, Loader2, ChevronLeft } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { verifyHarvestPhoto } from '@/ai/flows/verify-harvest-photo-flow';
import { useLocalization } from '@/context/localization-context';
import { Harvest } from '@/lib/types';
import { mockHarvests } from '@/lib/data';
import Link from 'next/link';
import { Skeleton } from './ui/skeleton';

const editHarvestFormSchema = z.object({
  herbName: z.string().min(2, { message: 'Herb name must be at least 2 characters.' }),
  quantity: z.coerce.number().positive({ message: 'Quantity must be a positive number.' }),
  unit: z.string().default('kg'),
  photo: z.custom<FileList>().optional(),
  location: z.string().optional(),
});

type EditHarvestFormValues = z.infer<typeof editHarvestFormSchema>;

const fileToDataUri = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
});

export function EditHarvestForm() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { t } = useLocalization();
  const { toast } = useToast();
  const [harvest, setHarvest] = useState<Harvest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const form = useForm<EditHarvestFormValues>({
    resolver: zodResolver(editHarvestFormSchema),
  });

  useEffect(() => {
    if (id) {
      const storedHarvests = JSON.parse(localStorage.getItem('harvests') || '[]');
      const allHarvests = [...mockHarvests, ...storedHarvests];
      const uniqueHarvestsMap = new Map(allHarvests.map(h => [h.id, h]));
      const foundHarvest = uniqueHarvestsMap.get(id) || null;
      
      setHarvest(foundHarvest);
      setIsLoading(false);

      if (foundHarvest) {
        form.reset({
          herbName: foundHarvest.herbName,
          quantity: foundHarvest.quantity,
          unit: foundHarvest.unit,
          location: `${foundHarvest.gps.lat.toFixed(4)}, ${foundHarvest.gps.lon.toFixed(4)}`,
        });
      }
    }
  }, [id, form]);

  async function onSubmit(data: EditHarvestFormValues) {
    if (!harvest) return;

    setIsProcessing(true);
    try {
      let newPhotoUrl = harvest.photoUrl;
      let newPhotoHint = harvest.photoHint;
      const photoFile = data.photo?.[0];

      if (photoFile) {
        const photoDataUri = await fileToDataUri(photoFile);
        const verificationResult = await verifyHarvestPhoto({
            photoDataUri,
            herbName: data.herbName,
        });

        if (!verificationResult.isPhotoGenuine) {
          toast({
              variant: 'destructive',
              title: t('Photo Verification Failed'),
              description: verificationResult.reason,
          });
          setIsProcessing(false);
          return;
        }
        
        toast({
            title: t('Photo Verified!'),
            description: verificationResult.reason,
            className: 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700'
        });
        newPhotoUrl = photoDataUri;
        newPhotoHint = `${data.herbName.toLowerCase()} plant`;
      }
      
      const locationParts = data.location?.split(',').map(part => parseFloat(part.trim())) || [0, 0];
      const updatedHarvest: Harvest = {
        ...harvest,
        herbName: data.herbName,
        quantity: data.quantity,
        unit: data.unit,
        photoUrl: newPhotoUrl,
        photoHint: newPhotoHint,
        gps: {
          lat: locationParts[0],
          lon: locationParts[1],
        },
      };

      const storedHarvests: Harvest[] = JSON.parse(localStorage.getItem('harvests') || '[]');
      const harvestIndex = storedHarvests.findIndex(h => h.id === id);

      let finalHarvests: Harvest[];
      if (harvestIndex > -1) {
        // If it's in local storage, update it in place.
        finalHarvests = [...storedHarvests];
        finalHarvests[harvestIndex] = updatedHarvest;
      } else {
        // If it's a mock harvest not yet in storage, add the updated version.
        finalHarvests = [...storedHarvests, updatedHarvest];
      }

      localStorage.setItem('harvests', JSON.stringify(finalHarvests));

      toast({
        title: t('Harvest Updated!'),
        description: t('Your changes have been saved.'),
      });
      router.push(`/harvests/${id}`);
      router.refresh();

    } catch (error) {
      console.error('Update failed', error);
      toast({
          variant: 'destructive',
          title: t('An error occurred'),
          description: t('Could not update the harvest at this time.'),
      });
    } finally {
      setIsProcessing(false);
    }
  }
  
  if (isLoading) {
      return (
          <Card>
              <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
              <CardContent className="space-y-6">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
              </CardContent>
          </Card>
      )
  }

  if (!harvest) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">{t('Harvest Not Found')}</h2>
        <p className="text-muted-foreground">
          {t("We couldn't find the harvest you're looking for.")}
        </p>
         <Button asChild variant="outline" size="sm" className="mt-4">
            <Link href="/harvests">
                <ChevronLeft className="mr-2 h-4 w-4" />
                {t('Back to All Harvests')}
            </Link>
        </Button>
      </div>
    );
  }

  return (
    <Card className="shadow-lg">
        <CardHeader>
            <CardTitle>{t('Update a Harvest')}</CardTitle>
            <CardDescription>{t('Change the details of your harvest below.')}</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                control={form.control}
                name="herbName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t('Herb Name')}</FormLabel>
                    <FormControl>
                        <Input placeholder={t('e.g., Lavender')} {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('Quantity')}</FormLabel>
                        <FormControl>
                            <Input type="number" step="0.1" placeholder='1.5' {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                     <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('Unit')}</FormLabel>
                        <FormControl>
                            <Input placeholder="kg" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                
                <FormField
                  control={form.control}
                  name="photo"
                  render={({ field: { onChange, onBlur, name, ref } }) => (
                    <FormItem>
                      <FormLabel>{t('Harvest Photo')}</FormLabel>
                      <FormControl>
                          <div className="relative">
                            <Input 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => onChange(e.target.files)}
                                onBlur={onBlur}
                                name={name}
                                ref={ref}
                                className="pr-12"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <Upload className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                      </FormControl>
                       <FormDescription>{t('Leave photo blank to keep the same one.')}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('GPS Coordinates')}</FormLabel>
                          <FormControl>
                              <Input placeholder='Lat, Lon' {...field} />
                          </FormControl>
                        <FormDescription>{t('You can manually edit the coordinates here.')}</FormDescription>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        {t('Cancel')}
                    </Button>
                    <Button type="submit" disabled={isProcessing}>
                        {isProcessing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t('Verifying Photo...')}
                            </>
                        ) : (
                            t('Update Harvest')
                        )}
                    </Button>
                </div>
            </form>
            </Form>
        </CardContent>
    </Card>
  );
}
