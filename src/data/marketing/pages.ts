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

interface MarketingStoryContent {
  eyebrow: string;
  title: string;
  body: string;
}

interface MarketingPage {
  seo: MarketingSeo;
  hero: MarketingHeroContent;
  proof?: ReadonlyArray<{ label: string; value: string }>;
  story?: MarketingStoryContent;
}

export const marketingPages = {
  home: {
    seo: {
      title: 'Swift Holdings | A home in Accra, built with certainty.',
      description:
        'Explore a more considered path to a home base in Oyarifa, Accra. Start with a private briefing.',
    },
    hero: {
      eyebrow: 'Oyarifa, Accra',
      title: 'A home in Accra, built with certainty.',
      lead: 'Swift Holdings starts with a clearer conversation for people planning a dependable home base in Accra from abroad.',
    },
    proof: [
      { label: 'Location', value: 'Oyarifa, Accra' },
      { label: 'Approach', value: 'Prefab-led precision' },
      { label: 'First step', value: 'Private briefing' },
    ],
    story: {
      eyebrow: 'A considered return',
      title: 'The better way to make Accra home from abroad.',
      body: 'A homecoming deserves more than distant assumptions. Swift brings together local context, a prefab-led direction, and a private briefing designed to make the next decision more informed.',
    },
  },
  village: {
    seo: {
      title: 'The Village | Swift Holdings',
      description:
        'Explore the Oyarifa context and the calmer homecoming rhythm Swift Holdings is designed to support.',
    },
    hero: {
      eyebrow: 'Oyarifa, Accra',
      title: 'A quieter way to return to Accra.',
      lead: 'A village direction for diaspora buyers seeking a more grounded home base, closer to family and local context.',
    },
    story: {
      eyebrow: 'A sense of place',
      title: 'Start with the setting, then the decisions.',
      body: 'A private briefing is the place to discuss what Oyarifa could mean for your return rhythm, your family, and the questions you want answered before you decide.',
    },
  },
  howItWorks: {
    seo: {
      title: 'How It Works | Swift Holdings',
      description:
        'Understand the four-part Swift Holdings briefing and decision path for a considered home base in Accra.',
    },
    hero: {
      eyebrow: 'A clearer next step',
      title: 'From first conversation to a home base.',
      lead: 'The process begins with the questions that matter to you, then moves only as the next details become clear.',
    },
  },
  ownership: {
    seo: {
      title: 'Ownership | Swift Holdings',
      description:
        'Learn what a private briefing can clarify before you make a decision about a Swift Holdings home base.',
    },
    hero: {
      eyebrow: 'A considered decision',
      title: 'Know what you are choosing before you commit.',
      lead: 'Swift is for buyers who want practical context and direct answers before deciding whether a home base in Accra is right for them.',
    },
    story: {
      eyebrow: 'Clarity first',
      title: 'A briefing should make the next decision easier to understand.',
      body: 'Use the conversation to discuss buyer fit, current project context, practical questions, and the details that need direct confirmation.',
    },
  },
  protections: {
    seo: {
      title: 'Protections | Swift Holdings',
      description:
        'See what Swift Holdings presents clearly, what remains to be confirmed, and what to ask in a private briefing.',
    },
    hero: {
      eyebrow: 'Buyer confidence',
      title: 'Clarity before confidence.',
      lead: 'The most useful safeguards begin with clear distinctions between what is known, what is illustrative, and what needs direct discussion.',
    },
  },
  accra: {
    seo: {
      title: 'Accra | Swift Holdings',
      description:
        'Consider the local context, return rhythm, and practical questions behind a home base in Oyarifa, Accra.',
    },
    hero: {
      eyebrow: 'Oyarifa perspective',
      title: 'A homecoming needs local context.',
      lead: 'A considered return starts with how you will use the home, who it serves, and what needs to be clear before you decide.',
    },
    story: {
      eyebrow: 'Practical context',
      title: 'Start with the questions that matter in Oyarifa.',
      body: 'How often will you be in Accra? Who will use the home? What needs to be clear before you decide? A private briefing creates space for those questions.',
    },
  },
  about: {
    seo: {
      title: 'About Swift Holdings',
      description:
        'Learn why Swift Holdings exists and why a buyer-first conversation matters for a considered return to Accra.',
    },
    hero: {
      eyebrow: 'About Swift',
      title: 'Why Swift exists.',
      lead: 'Swift exists to make a return to Accra feel more legible, more grounded, and more considered from abroad.',
    },
  },
  briefing: {
    seo: {
      title: 'Private Briefing | Swift Holdings',
      description:
        'Tell Swift Holdings what you are planning and begin with a private, buyer-first conversation about a home base in Accra.',
    },
    hero: {
      eyebrow: 'Private briefing',
      title: 'Tell us what you are planning.',
      lead: 'Share the essentials and Swift will use them only to reply to your request with a more relevant next conversation.',
    },
  },
} as const satisfies Record<MarketingPageKey, MarketingPage>;
