export const hubs = [
  { id: 'accra', name: 'Greater Accra', label: 'Oyarifa Hub', units: 48, note: 'Flagship — Greater Accra' },
  { id: 'ashanti', name: 'Ashanti', label: 'Kumasi Hub', units: 24, note: 'Ashanti — Kumasi' },
  { id: 'western', name: 'Western', label: 'Takoradi Hub', units: 12, note: 'Western — Takoradi' },
  { id: 'northern', name: 'Northern', label: 'Tamale Hub', units: 12, note: 'Northern — Tamale' },
] as const;

export type Hub = (typeof hubs)[number];
