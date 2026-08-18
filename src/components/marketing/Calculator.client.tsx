import { useState } from 'react';
import {
  CALCULATOR_DEFAULTS,
  grossMonthlyIncome,
  monthlyInvestorIncome,
} from '@/data/marketing/calculator';

interface Props {
  initialOccupancy?: number;
  initialAdr?: number;
}

export default function Calculator({
  initialOccupancy = CALCULATOR_DEFAULTS.occupancy,
  initialAdr = CALCULATOR_DEFAULTS.adr,
}: Props): React.JSX.Element {
  const [occupancy, setOccupancy] = useState(initialOccupancy);
  const [adr, setAdr] = useState(initialAdr);

  const gross = grossMonthlyIncome(occupancy, adr);
  const investor = monthlyInvestorIncome(
    occupancy,
    adr,
    CALCULATOR_DEFAULTS.share
  );

  return (
    <div className="border border-[var(--marketing-gold-line)] bg-[var(--marketing-obsidian-900)] p-8 text-[var(--marketing-ink-on-dark)] lg:p-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="marketing-eyebrow">The public view</p>
          <p className="marketing-display mt-2 text-5xl text-[var(--marketing-gold-400)]">
            ${investor.toLocaleString()}
          </p>
          <p className="mt-1 text-sm text-[var(--marketing-dim-on-dark)]">
            estimated monthly share at {Math.round(occupancy * 100)}% occupancy
            · ${adr} ADR
          </p>
        </div>
        <p className="max-w-44 text-xs leading-5 text-[var(--marketing-dim-on-dark)]">
          {CALCULATOR_DEFAULTS.projectionNote}
        </p>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <label className="grid gap-2 text-sm">
          <span className="text-[var(--marketing-dim-on-dark)]">Occupancy</span>
          <input
            type="range"
            min={CALCULATOR_DEFAULTS.occupancyMin * 100}
            max={CALCULATOR_DEFAULTS.occupancyMax * 100}
            value={Math.round(occupancy * 100)}
            onChange={event => setOccupancy(Number(event.target.value) / 100)}
            className="accent-[var(--marketing-gold-500)]"
          />
          <span className="text-xs text-[var(--marketing-dim-on-dark)]">
            {Math.round(occupancy * 100)}%
          </span>
        </label>
        <label className="grid gap-2 text-sm">
          <span className="text-[var(--marketing-dim-on-dark)]">
            Average daily rate
          </span>
          <input
            type="range"
            min={CALCULATOR_DEFAULTS.adrMin}
            max={CALCULATOR_DEFAULTS.adrMax}
            value={adr}
            onChange={event => setAdr(Number(event.target.value))}
            className="accent-[var(--marketing-gold-500)]"
          />
          <span className="text-xs text-[var(--marketing-dim-on-dark)]">
            ${adr} · market range ${CALCULATOR_DEFAULTS.adrMin}– $
            {CALCULATOR_DEFAULTS.adrMax}
          </span>
        </label>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-px bg-[var(--marketing-gold-line)] text-sm">
        <div className="bg-[var(--marketing-obsidian-900)] p-4">
          <span className="text-[var(--marketing-dim-on-dark)]">
            Gross monthly
          </span>
          <span className="mt-1 block font-medium text-[var(--marketing-ink-on-dark)]">
            ${gross.toLocaleString()}
          </span>
        </div>
        <div className="bg-[var(--marketing-obsidian-900)] p-4">
          <span className="text-[var(--marketing-dim-on-dark)]">
            Your share — 70%
          </span>
          <span className="mt-1 block font-medium text-[var(--marketing-gold-400)]">
            ${investor.toLocaleString()}
          </span>
        </div>
      </div>
      <a className="marketing-button-primary mt-6 w-full" href="/briefing">
        Unlock full scenarios with a briefing
      </a>
    </div>
  );
}
