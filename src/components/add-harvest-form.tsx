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
import { MapPin, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const harvestFormSchema = z.object({
  herbName: z.string().min(2, { message: 'Herb name must be at least 2 characters.' }),
  quantity: z.coerce.number().positive({ message: 'Quantity must be a positive number.' }),
  unit: z.string().default('kg'),
  photo: z.any().refine(files => files?.length > 0, 'A photo is required.'),
  location: z.string().optional(),
});

type HarvestFormValues = z.infer<typeof harvestFormSchema>;

export function AddHarvestForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [location, setLocation] = useState<string>('');
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const form = useForm<HarvestFormValues>({
    resolver: zodResolver(harvestFormSchema),
    defaultValues: {
      herbName: '',
      quantity: 0,
      unit: 'kg',
    },
  });

  function onSubmit(data: HarvestFormValues) {
    console.log(data);
    toast({
      title: 'Harvest Recorded!',
      description: `${data.quantity} ${data.unit} of ${data.herbName} has been saved.`,
    });
    router.push('/dashboard');
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
            title: "Location Captured",
            description: `Coordinates: ${locString}`
        })
    }, 1000);
  }

  return (
    <Card className="shadow-lg">
        <CardHeader>
            <CardTitle>Add New Harvest</CardTitle>
            <CardDescription>Fill in the details of your recent harvest.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                control={form.control}
                name="herbName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Herb Name</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Lavender" {...field} />
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
                        <FormLabel>Quantity</FormLabel>
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
                        <FormLabel>Unit</FormLabel>
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
                      <FormLabel>Harvest Photo</FormLabel>
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
                    <FormLabel>GPS Coordinates</FormLabel>
                    <div className="flex items-center gap-2">
                        <FormControl>
                            <Input placeholder="Location will appear here..." value={location} readOnly />
                        </FormControl>
                        <Button type="button" variant="outline" onClick={handleGetLocation} disabled={isLocating}>
                            <MapPin className="mr-2 h-4 w-4" />
                            {isLocating ? 'Getting...' : 'Get Location'}
                        </Button>
                    </div>
                    <FormDescription>Capture the location of your harvest.</FormDescription>
                </FormItem>


                <Button type="submit" className="w-full">Save Harvest</Button>
            </form>
            </Form>
        </CardContent>
    </Card>
  );
}
