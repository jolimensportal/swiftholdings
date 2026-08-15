export const marketingSite = {
  name: 'Swift Holdings',
  email: 'info@swiftholdings.org',
  phone: '+233 544 101016',
  address: '20 Edmonton St, Madina, Accra',
  primaryCta: { label: 'Request a private briefing', href: '/briefing' },
  navigation: [
    { href: '/village', label: 'The Village' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/ownership', label: 'Ownership' },
    { href: '/protections', label: 'Protections' },
    { href: '/accra', label: 'Accra' },
    { href: '/about', label: 'About' },
  ],
} as const;

export type MarketingPageKey =
  | 'home'
  | 'village'
  | 'howItWorks'
  | 'ownership'
  | 'protections'
  | 'accra'
  | 'about'
  | 'briefing';
