export const CALCULATOR_DEFAULTS = {
  entry: 50000,
  occupancy: 0.88,
  adr: 132,
  share: 0.7,
  adrMin: 100,
  adrMax: 132,
  occupancyMin: 0.7,
  occupancyMax: 0.95,
  nightsPerMonth: 30,
  projectionNote:
    '350% projected return across the five-year operating lock-in — full scenarios behind the briefing.',
} as const;

export const grossMonthlyIncome = (occupancy: number, adr: number): number =>
  Math.round(CALCULATOR_DEFAULTS.nightsPerMonth * occupancy * adr);

export const monthlyInvestorIncome = (
  occupancy: number,
  adr: number,
  share: number
): number => Math.round((grossMonthlyIncome(occupancy, adr) * share) / 10) * 10;
