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
    herbName: 'Basil',
    quantity: 1.5,
    unit: 'kg',
    date: new Date('2024-07-20T10:00:00Z'),
    photoUrl: 'https://picsum.photos/seed/harvest1/400/300',
    photoHint: 'basil leaves',
    gps: { lat: 34.0522, lon: -118.2437 },
  },
  {
    id: '2',
    herbName: 'Mint',
    quantity: 2.0,
    unit: 'kg',
    date: new Date('2024-07-19T14:30:00Z'),
    photoUrl: 'https://picsum.photos/seed/harvest2/400/300',
    photoHint: 'mint plant',
    gps: { lat: 34.0522, lon: -118.2437 },
  },
  {
    id: '3',
    herbName: 'Rosemary',
    quantity: 0.8,
    unit: 'kg',
    date: new Date('2024-07-18T09:00:00Z'),
    photoUrl: 'https://picsum.photos/seed/harvest3/400/300',
    photoHint: 'rosemary sprigs',
    gps: { lat: 34.0522, lon: -118.2437 },
  },
  {
    id: '4',
    herbName: 'Thyme',
    quantity: 1.2,
    unit: 'kg',
    date: new Date('2024-07-17T11:00:00Z'),
    photoUrl: 'https://picsum.photos/seed/harvest4/400/300',
    photoHint: 'thyme plant',
    gps: { lat: 34.0522, lon: -118.2437 },
  },
    {
    id: '5',
    herbName: 'Cilantro',
    quantity: 2.5,
    unit: 'kg',
    date: new Date('2024-07-16T16:00:00Z'),
    photoUrl: 'https://picsum.photos/seed/harvest5/400/300',
    photoHint: 'cilantro leaves',
    gps: { lat: 34.0522, lon: -118.2437 },
  },
];
