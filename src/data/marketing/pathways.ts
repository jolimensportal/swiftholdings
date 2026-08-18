export interface Pathway {
  id: string;
  name: string;
  summary: string;
  accent: 'gold' | 'platinum';
  keyFacts: readonly string[];
  cta: { label: string; href: string };
  minimum?: string;
}

export const pathways: readonly Pathway[] = [
  {
    id: 'owner',
    name: 'Owner-Investor',
    summary:
      'Set up your own P7 capsule from a $50,000 entry and share revenue 70 / 30. The path for diaspora families building a return to Ghana.',
    accent: 'gold',
    keyFacts: ['70 / 30 revenue share', '$50,000 entry', '5-year operating lock-in'],
    cta: { label: 'See the model', href: '/ownership' },
  },
  {
    id: 'fund',
    name: 'The Ecosystem Fund',
    summary:
      'Institutional capital deployed across hubs at scale — the Partnership Pathway. The Fund is one of two ways into the project.',
    accent: 'platinum',
    keyFacts: ['Partnership Pathway 2', 'Deployment across all four hubs', 'Institutional reporting'],
    cta: { label: 'Discuss the Fund', href: '/briefing' },
    minimum: 'Institutional minimums apply',
  },
] as const;