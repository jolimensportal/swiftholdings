export const marketStatistics = {
  accommodationDeficit: '300,000+',
  nationalDeficit: '2,000,000+',
  growth: '6–10%',
  marketOccupancy: '33–44%',
  unitTarget: '88%',
  note: 'Ghanaian accommodation demand is outrunning supply in every city we are building in. Full sources are held in the member dossier.',
} as const;

export interface SwiftHub {
  city: string;
  region: string;
  role: string;
  capsules: number;
  x: number;
  y: number;
}

export const swiftHubs: readonly SwiftHub[] = [
  {
    city: 'Oyarifa',
    region: 'Accra',
    role: 'Flagship village — first capsule site',
    capsules: 42,
    x: 62,
    y: 34,
  },
  {
    city: 'Kumasi',
    region: 'Ashanti',
    role: 'Commercial heart of the south',
    capsules: 24,
    x: 28,
    y: 44,
  },
  {
    city: 'Tamale',
    region: 'Northern',
    role: 'Gateway to the north',
    capsules: 18,
    x: 52,
    y: 14,
  },
  {
    city: 'Takoradi',
    region: 'Western',
    role: 'Oil and port city',
    capsules: 12,
    x: 22,
    y: 66,
  },
] as const;
