import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { type Harvest } from '@/lib/types';
import { MapPin, Weight, Calendar } from 'lucide-react';
import { format } from 'date-fns';

type HarvestCardProps = {
  harvest: Harvest;
};

export function HarvestCard({ harvest }: HarvestCardProps) {
  return (
    <Card className="overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48 w-full">
        <Image
          src={harvest.photoUrl}
          alt={`Photo of ${harvest.herbName}`}
          fill
          style={{ objectFit: 'cover' }}
          data-ai-hint={harvest.photoHint}
        />
      </div>
      <CardHeader>
        <CardTitle className="font-headline">{harvest.herbName}</CardTitle>
        <CardDescription className="flex items-center gap-2 pt-1">
          <Calendar className="h-4 w-4" />
          {format(harvest.date, 'MMMM d, yyyy')}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Weight className="h-4 w-4 text-primary" />
          <span>{harvest.quantity} {harvest.unit}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          <span>{harvest.gps.lat.toFixed(2)}, {harvest.gps.lon.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
