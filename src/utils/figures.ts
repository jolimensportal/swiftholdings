/**
 * Single source for every commercial term shown in public copy.
 *
 * There were previously two sets in play. `figures.ts` said $100 a share, an
 * 80/20 split and a cheapest tier of $1,200, and fed the older pages. The
 * rebuilt pages hardcoded a different model: $50,000 per capsule, 70/30, with
 * the briefing form asking for a $50,000 floor — so somebody holding $1,200 had
 * no way to submit. Both were live at once.
 *
 * $50,000 / 70/30 is treated as canonical because it is what every rebuilt page
 * states, what the discovery flow collects, and what the owner-facing pages
 * (/ownership, /protections) describe in detail. ADR, occupancy and the net
 * yield range are market context rather than offer terms and are unchanged.
 *
 * Anything that quotes a price, a split, a tier or a yield must read from here.
 */
export const figures = {
  /** Entry price for one P7 capsule (38 m²), fully installed. */
  entryPrice: 50000,
  adrLow: 100,
  adrHigh: 132,
  /** Market occupancy range. The model assumes a higher figure than this. */
  occupancyLow: 33,
  occupancyHigh: 44,
  /** Assumed occupancy in the published model. */
  modelOccupancy: 88,
  yieldLow: 6,
  yieldHigh: 10,
  /** Investor / operator split. */
  profitShareInvestor: 70,
  profitShareOperator: 30,
  settlement: 'Monthly',
  tiers: [
    {
      name: 'Starter',
      capsules: 1,
      priceFrom: 50000,
      featured: false,
      capsulesLabel: '1 capsule',
      priceLabel: '$50,000',
      note: 'One P7 capsule, 38 m², fully installed. Monthly settlement in GHS.',
    },
    {
      name: 'Cluster',
      capsules: 4,
      priceFrom: 200000,
      featured: true,
      capsulesLabel: '4 capsules',
      priceLabel: 'from $200,000',
      note: 'A row within the village. Smoother occupancy across units.',
    },
    {
      name: 'Block',
      capsules: 12,
      priceFrom: 600000,
      featured: false,
      capsulesLabel: '12 capsules',
      priceLabel: 'from $600,000',
      note: 'A whole block. Priority on new phases and the buy-back window.',
    },
  ],
  contacts: {
    email: 'info@swifthorizon.com.gh',
    phoneGh: '+233 544 101016',
    phoneCa: '+1 437 421 0963',
    address: '20 Edmonton St, Madina, Accra',
  },
} as const;

export type Figures = typeof figures;