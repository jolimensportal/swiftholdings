export const marketingSite = {
  name: 'THE SWIFT PROJECT',
  legalName: 'Swift Holdings',
  email: 'info@swiftholdings.org',
  partnershipsEmail: 'partnerships@swiftholdings-ghana.com',
  phone: '+233 544 101016',
  phoneNorthAmerica: '+1 437 421 0963',
  address: '20 Edmonton St, Madina, Accra',
  primaryCta: { label: 'Request a private briefing', href: '/briefing' },
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
      name: 'Stay',
      summary:
        'Book a visit. Feel the village before you decide anything.',
      cta: { label: 'Explore stays', href: '/village' },
    },
    {
      name: 'Own',
      summary:
        'Explore ownership — the residence, the operation, the numbers.',
      cta: { label: 'See ownership', href: '/ownership' },
    },
    {
      name: 'Partner',
      summary:
        'Bring land, capital, or operations. Build a hub with us.',
      cta: { label: 'Explore partnership', href: '/partnership' },
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
  // soft domain until purchase — env PUBLIC_SITE_URL overrides, else pages.dev
  undefined,
);
