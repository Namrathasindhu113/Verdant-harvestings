export type Harvest = {
  id: string;
  herbName: string;
  quantity: number;
  unit: string;
  date: Date;
  photoUrl: string;
  photoHint: string;
  gps: {
    lat: number;
    lon: number;
  };
};
