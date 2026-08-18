import type { MarketingPageKey } from './site';

interface MarketingSeo {
  title: string;
  description: string;
}

interface MarketingHeroContent {
  eyebrow: string;
  title: string;
  lead: string;
}

interface MarketingPage {
  seo: MarketingSeo;
  hero: MarketingHeroContent;
  secondaryCta?: { label: string; href: string };
}

export const marketingPages = {
  home: {
    seo: {
      title:
        'The Swift Project | A luxury hospitality asset in Ghana, built with absolute certainty.',
      description:
        'Own a P7 capsule in Ghana on a 70 / 30 model. The Swift Project — a membership ecosystem of luxury modular hospitality across Accra, Kumasi, Tamale, and Takoradi.',
    },
    hero: {
      eyebrow: 'Oyarifa · Accra',
      title:
        'A luxury hospitality asset in Ghana, built with absolute certainty.',
      lead: 'The Swift Project is a membership ecosystem: guests book stays, members hold the detail, and owner-investors operate their own capsule on a 70 / 30 revenue share.',
    },
    secondaryCta: { label: 'See the model', href: '/ownership' },
  },
  village: {
    seo: {
      title: 'The Village | The Swift Project',
      description:
        'The Oyarifa village: P7 capsules, shared land, the nine-layer wall system, and solar-ready design.',
    },
    hero: {
      eyebrow: 'Oyarifa · Accra',
      title: 'A village of capsules, held in common.',
      lead: 'Owner-investors hold the capsule; the village holds the land. Shared infrastructure, secure compounds, and a calmer rhythm than the city core.',
    },
    secondaryCta: { label: 'See the locations', href: '/locations' },
  },
  howItWorks: {
    seo: {
      title: 'How It Works | The Swift Project',
      description:
        'From discovery briefing to revenue: the five-phase path to a P7 capsule and the five-year operating lock-in.',
    },
    hero: {
      eyebrow: 'The path',
      title: 'From first conversation to first revenue.',
      lead: 'Five phases, a five-year operating lock-in, and a 70 / 30 share settled monthly. The path is the same for every capsule.',
    },
    secondaryCta: { label: 'Check the numbers', href: '/ownership' },
  },
  ownership: {
    seo: {
      title: 'Ownership & Financials | The Swift Project',
      description:
        'A $50,000 entry, a 70 / 30 revenue share, and an operating model built on documented market data across Ghana.',
    },
    hero: {
      eyebrow: 'Ownership & financials',
      title: 'Know what you are choosing before you commit.',
      lead: 'One entry point, one share, one operator. The Swift Project keeps the owner path legible: $50,000, 70 / 30, and a monthly settlement.',
    },
    secondaryCta: { label: 'See the protections', href: '/protections' },
  },
  protections: {
    seo: {
      title: 'Protections | The Swift Project',
      description:
        'Escrow, Ghanaian land law, insurance, and the legal dossier behind every capsule.',
    },
    hero: {
      eyebrow: 'Protections',
      title: 'Clarity before confidence.',
      lead: 'Deposits into escrow, title under Ghanaian law, insured builds, and a legal dossier members can read in full.',
    },
    secondaryCta: { label: 'Read the dossier', href: '/resources' },
  },
  locations: {
    seo: {
      title: 'Locations | The Swift Project',
      description:
        'Four hubs — Oyarifa (Accra), Kumasi, Tamale, and Takoradi — and the market case for each.',
    },
    hero: {
      eyebrow: 'Locations',
      title: 'Four hubs, one standard.',
      lead: 'The same capsule, the same 70 / 30, the same build standard — across the cities where Ghanaian demand is growing fastest.',
    },
    secondaryCta: { label: 'Start with the village', href: '/village' },
  },
  partnership: {
    seo: {
      title: 'Partnership | The Swift Project',
      description:
        'Two pathways: become an owner-investor, or partner with the Ecosystem Fund for institutional deployment.',
    },
    hero: {
      eyebrow: 'Partnership',
      title: 'Two ways into the project.',
      lead: 'Owner-investors set up capsules on the 70 / 30. The Ecosystem Fund deploys institutional capital across hubs at scale.',
    },
    secondaryCta: { label: 'See the financials', href: '/ownership' },
  },
  about: {
    seo: {
      title: 'About | The Swift Project',
      description:
        'Why The Swift Project exists: certainty, craft, and a better model for modular hospitality in Ghana.',
    },
    hero: {
      eyebrow: 'About',
      title: 'Built with certainty, not promises.',
      lead: 'Swift Holdings builds, operates, and shares the Swift Project — a membership ecosystem designed for the diaspora returning home.',
    },
    secondaryCta: { label: 'Request a briefing', href: '/briefing' },
  },
  resources: {
    seo: {
      title: 'Resources | The Swift Project',
      description:
        'The partnership summary, investor summary, and institutional whitepaper — behind the discovery briefing.',
    },
    hero: {
      eyebrow: 'Resources',
      title: 'The detail, held for members.',
      lead: 'Three long-form documents carry the real substance. They open after a discovery briefing, and stay with members in the portal.',
    },
    secondaryCta: { label: 'Join through a briefing', href: '/briefing' },
  },
  briefing: {
    seo: {
      title: 'Briefing | The Swift Project',
      description:
        'Request a private discovery briefing on owning a P7 capsule in Ghana.',
    },
    hero: {
      eyebrow: 'Private briefing',
      title: 'Tell us what you are planning.',
      lead: 'Share the essentials, and we reply with a more relevant next conversation. Briefings are encrypted, recorded, and summarised.',
    },
  },
} as const satisfies Record<MarketingPageKey, MarketingPage>;