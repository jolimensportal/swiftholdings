export const capsules = [
  {
    id: 'P7',
    name: 'P7 Apple Capsule',
    size: '38m²',
    beds: '1 bed / 1 bath',
    price: 50000,
    spec: '9-layer wall, CIGS solar-ready, composite deck, cocoon chair, privacy slats',
    hubIds: ['accra', 'ashanti', 'western', 'northern'] as const,
  },
  {
    id: 'MER',
    name: 'Meridian 3-Bed',
    size: '1,850 sqft',
    beds: '3 bed / 2 bath',
    price: 50000,
    hubIds: ['accra'] as const,
  },
  {
    id: 'SAV',
    name: 'Savannah 4-Bed',
    size: '2,400 sqft',
    beds: '4 bed / 3 bath',
    price: 75000,
    hubIds: ['ashanti'] as const,
  },
  {
    id: 'LAG',
    name: 'Lagoon Studio Court',
    size: '480 sqft ×24',
    beds: '24 studios',
    price: 20000,
    hubIds: ['western'] as const,
  },
  {
    id: 'KET',
    name: 'Keta Waterfront',
    size: '1,200 sqft',
    beds: '2 bed / 1 bath',
    price: 60000,
    hubIds: ['northern'] as const,
  },
] as const;

export type Capsule = (typeof capsules)[number];
