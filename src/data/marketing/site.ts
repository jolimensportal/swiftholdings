export const marketingSite = {
  name: 'The Swift Project',
  legalName: 'Swift Holdings',
  email: 'info@swiftholdings.org',
  partnershipsEmail: 'partnerships@swiftholdings-ghana.com',
  phone: '+233 544 101016',
  phoneNorthAmerica: '+1 437 421 0963',
  address: '20 Edmonton St, Madina, Accra',
  primaryCta: { label: 'Request a briefing', href: '/briefing' },
  navigation: [
    { href: '/village', label: 'The Village' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/ownership', label: 'Ownership & Financials' },
    { href: '/protections', label: 'Protections' },
    { href: '/locations', label: 'Locations' },
    { href: '/partnership', label: 'Partnership' },
    { href: '/about', label: 'About' },
    { href: '/resources', label: 'Resources' },
  ],
  tiers: [
    {
      name: 'Guest',
      summary:
        'Browse and book short stays at project capsules — like a gated community open to the public.',
      cta: { label: 'Explore stays', href: '/village' },
    },
    {
      name: 'Member',
      summary:
        'Join through the discovery briefing for full yield data, availability, pricing, and the legal dossier.',
      cta: { label: 'Join through a briefing', href: '/briefing' },
    },
    {
      name: 'Owner-Investor',
      summary:
        'Set up a P7 capsule from a $50,000 entry and share revenue 70 / 30. Primary audience: the diaspora.',
      cta: { label: 'See the model', href: '/ownership' },
    },
  ],
} as const;

export type MarketingPageKey =
  | 'home'
  | 'village'
  | 'howItWorks'
  | 'ownership'
  | 'protections'
  | 'locations'
  | 'partnership'
  | 'about'
  | 'resources'
  | 'briefing';

export const getCanonicalSiteUrl = (envUrl?: string): string => {
  const v = envUrl?.trim();
  if (v && v.startsWith('http')) return v.replace(/\/$/, '');
  return 'https://swiftholdings.pages.dev';
};

export const marketingSiteUrl = getCanonicalSiteUrl(
  typeof import.meta !== 'undefined'
    ? ((import.meta as unknown as { env?: Record<string, string> }).env?.PUBLIC_SITE_URL as string | undefined)
    : undefined,
);
