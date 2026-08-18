export interface GatedDocument {
  title: string;
  form: string;
  pages: number;
  length: string;
  gate: string;
}

export const documents: readonly GatedDocument[] = [
  {
    title: 'Partnership Summary',
    form: 'Bound summary',
    pages: 42,
    length: '45 minutes',
    gate: 'Opens after a discovery briefing',
  },
  {
    title: 'Investor Summary & Partnership Models',
    form: 'Financial edition',
    pages: 38,
    length: '1.5 hours',
    gate: 'Opens after a discovery briefing',
  },
  {
    title: 'Institutional Modular Hospitality in Ghana',
    form: 'Whitepaper',
    pages: 24,
    length: '2 hours',
    gate: 'Opens after a discovery briefing',
  },
] as const;