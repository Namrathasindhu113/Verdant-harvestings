
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
import { MapPin, Upload, Loader2, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { verifyHarvestPhoto } from '@/ai/flows/verify-harvest-photo-flow';
import { useLocalization } from '@/context/localization-context';
import { mockHarvests } from '@/lib/data';
import { Harvest } from '@/lib/types';

const harvestFormSchema = z.object({
  herbName: z.string().min(2, { message: 'Herb name must be at least 2 characters.' }),
  quantity: z.coerce.number().positive({ message: 'Quantity must be a positive number.' }),
  unit: z.string().default('kg'),
  photo: z.custom<FileList>().refine(files => files?.length > 0, 'A photo is required.'),
  location: z.string().optional(),
});

type HarvestFormValues = z.infer<typeof harvestFormSchema>;

const fileToDataUri = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
});


export function AddHarvestForm() {
  const router = useRouter();
  const { t } = useLocalization();
  const { toast } = useToast();
  const [location, setLocation] = useState<string>('');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const form = useForm<HarvestFormValues>({
    resolver: zodResolver(harvestFormSchema),
    defaultValues: {
      herbName: '',
      quantity: 0,
      unit: 'kg',
    },
  });

  async function onSubmit(data: HarvestFormValues) {
    setIsVerifying(true);
    try {
        const photoFile = data.photo[0];
        const photoDataUri = await fileToDataUri(photoFile);

        const verificationResult = await verifyHarvestPhoto({
            photoDataUri,
            herbName: data.herbName,
        });

        if (verificationResult.isPhotoGenuine) {
            toast({
                title: t('Photo Verified!'),
                description: verificationResult.reason,
                className: 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700'
            });

            // Save the harvest to local storage
            const newHarvest: Harvest = {
              id: new Date().toISOString(),
              herbName: data.herbName,
              quantity: data.quantity,
              unit: data.unit,
              date: new Date(),
              photoUrl: photoDataUri,
              photoHint: `${data.herbName.toLowerCase()} plant`,
              gps: {
                lat: parseFloat(location.split(',')[0] || '0'),
                lon: parseFloat(location.split(',')[1] || '0'),
              },
            };
            
            const storedHarvests = JSON.parse(localStorage.getItem('harvests') || '[]');
            localStorage.setItem('harvests', JSON.stringify([newHarvest, ...storedHarvests]));

            toast({
              title: t('Harvest Recorded!'),
              description: t('{{quantity}} {{unit}} of {{herbName}} has been saved.', data),
            });
            router.push('/harvests');
            router.refresh();

        } else {
            toast({
                variant: 'destructive',
                title: t('Photo Verification Failed'),
                description: verificationResult.reason,
            });
        }

    } catch (error) {
        console.error('Verification failed', error);
        toast({
            variant: 'destructive',
            title: t('An error occurred'),
            description: t('Could not verify the photo at this time.'),
        })
    } finally {
        setIsVerifying(false);
    }
  }

  function handleGetLocation() {
    setIsLocating(true);
    // Simulate getting GPS coordinates
    setTimeout(() => {
        const mockLat = (34.0522 + (Math.random() - 0.5) * 0.1).toFixed(4);
        const mockLon = (-118.2437 + (Math.random() - 0.5) * 0.1).toFixed(4);
        const locString = `${mockLat}, ${mockLon}`;
        setLocation(locString);
        form.setValue('location', locString);
        setIsLocating(false);
        toast({
            title: t("Location Captured"),
            description: `${t('Coordinates:')} ${locString}`
        })
    }, 1000);
  }

  return (
    <Card className="shadow-lg">
        <CardHeader>
            <CardTitle>{t('Add New Harvest')}</CardTitle>
            <CardDescription>{t('Fill in the details of your recent harvest. The photo will be verified by AI.')}</CardDescription>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormItem>
                    <FormLabel>{t('GPS Coordinates')}</FormLabel>
                    <div className="flex items-center gap-2">
                        <FormControl>
                            <Input placeholder={t('Location will appear here...')} value={location} readOnly />
                        </FormControl>
                        <Button type="button" variant="outline" onClick={handleGetLocation} disabled={isLocating}>
                            <MapPin className="mr-2 h-4 w-4" />
                            {isLocating ? t('Getting...') : t('Get Location')}
                        </Button>
                    </div>
                    <FormDescription>{t('Capture the location of your harvest.')}</FormDescription>
                </FormItem>


                <Button type="submit" className="w-full" disabled={isVerifying}>
                    {isVerifying ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t('Verifying Photo...')}
                        </>
                    ) : (
                        t('Save Harvest')
                    )}
                </Button>
            </form>
            </Form>
        </CardContent>
    </Card>
  );
}
