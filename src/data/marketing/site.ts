export const MEMBER_DASHBOARD_URL = 'https://portal.swifthorizon.com.gh';

export const marketingSite = {
  name: 'SWIFT HORIZON',
  legalName: 'Swift Horizon Limited',  // registered legal entity; brand and company name are the same
  email: 'info@swifthorizon.com.gh',
  partnershipsEmail: 'partners@swifthorizon.com.gh',
  phone: '+233 544 101016',
  phoneNorthAmerica: '+1 437 421 0963',
  address: '20 Edmonton St, Madina, Accra',
  primaryCta: { label: 'Request a private briefing', href: '/briefing' },
  // The member portal is the logged-in section of this same site, proxied to
  // its own Worker server-side. Users only ever see swifthorizon.com.gh.
  memberPortal: { label: 'Member sign in', href: MEMBER_DASHBOARD_URL },
  navigation: [
    { href: '/village', label: 'The Village' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/ownership', label: 'Ownership' },
    { href: '/locations', label: 'Locations' },
    { href: '/partnership', label: 'Partnership' },
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
  return 'https://swifthorizon.com.gh';
};

export const marketingSiteUrl = getCanonicalSiteUrl(
  'https://swifthorizon.com.gh',
);
