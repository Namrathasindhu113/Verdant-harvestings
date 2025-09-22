import type { Harvest } from '@/lib/types';

export const mockUser = {
  name: 'Jane Farmer',
  email: 'farmer@example.com',
  rewards: 1250,
  avatar: 'https://picsum.photos/seed/avatar1/150/150',
};

export const mockHarvests: Harvest[] = [
  {
    id: '1',
    herbName: 'Ashwagandha',
    quantity: 1.5,
    unit: 'kg',
    date: new Date('2024-07-20T10:00:00Z'),
    photoUrl: 'https://picsum.photos/seed/medicinal1/400/300',
    photoHint: 'ashwagandha plant',
    gps: { lat: 34.0522, lon: -118.2437 },
  },
  {
    id: '2',
    herbName: 'Tulsi (Holy Basil)',
    quantity: 2.0,
    unit: 'kg',
    date: new Date('2024-07-19T14:30:00Z'),
    photoUrl: 'https://picsum.photos/seed/medicinal2/400/300',
    photoHint: 'tulsi plant',
    gps: { lat: 34.0522, lon: -118.2437 },
  },
  {
    id: '3',
    herbName: 'Neem',
    quantity: 0.8,
    unit: 'kg',
    date: new Date('2024-07-18T09:00:00Z'),
    photoUrl: 'https://picsum.photos/seed/medicinal3/400/300',
    photoHint: 'neem leaves',
    gps: { lat: 34.0522, lon: -118.2437 },
  },
  {
    id: '4',
    herbName: 'Aloe Vera',
    quantity: 1.2,
    unit: 'kg',
    date: new Date('2024-07-17T11:00:00Z'),
    photoUrl: 'https://picsum.photos/seed/medicinal4/400/300',
    photoHint: 'aloe vera',
    gps: { lat: 34.0522, lon: -118.2437 },
  },
    {
    id: '5',
    herbName: 'Turmeric',
    quantity: 2.5,
    unit: 'kg',
    date: new Date('2024-07-16T16:00:00Z'),
    photoUrl: 'https://picsum.photos/seed/medicinal5/400/300',
    photoHint: 'turmeric plant',
    gps: { lat: 34.0522, lon: -118.2437 },
  },
];
