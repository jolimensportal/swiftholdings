import { describe, expect, it } from 'vitest';
import {
  CALCULATOR_DEFAULTS,
  monthlyInvestorIncome,
  grossMonthlyIncome,
} from './calculator';

describe('calculator', () => {
  it('matches the approved default figure: $50K entry, 88% occupancy, $132 ADR, 70% share', () => {
    const { occupancy, adr, share } = CALCULATOR_DEFAULTS;

    expect(monthlyInvestorIncome(occupancy, adr, share)).toBe(2440);
  });

  it('computes gross income as nights × occupancy × ADR', () => {
    expect(grossMonthlyIncome(1, 100)).toBe(3000);
  });

  it('rounds to the nearest ten dollars', () => {
    expect(monthlyInvestorIncome(0.88, 132, 0.7)).toBe(2440);
  });

  it('returns zero for zero occupancy', () => {
    expect(monthlyInvestorIncome(0, 132, 0.7)).toBe(0);
  });
});
