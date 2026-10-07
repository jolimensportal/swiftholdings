import Image from "next/image";

import { capsuleImageUrl, formatGhs, formatUsd, type Holding } from "@/server/swift-api";

interface CapsulePlateProps {
  holding: Holding;
  /** Hides the figures when the surrounding card already shows them. */
  showFigures?: boolean;
}

const STATUS_LABEL: Record<Holding["status"], string> = {
  "in-revenue": "In revenue",
  building: "In build",
  completed: "Completed",
};

/**
 * A capsule as a place rather than a row of figures.
 *
 * The photograph is the reason this exists: a member is buying a specific
 * apartment, so the unit should be recognisable at a glance. Where no hero has
 * been uploaded the plate falls back to a quiet typographic ground rather than
 * an empty grey box, which keeps the page composed before photography lands.
 */
export function CapsulePlate({ holding, showFigures = true }: CapsulePlateProps) {
  const { heroImageId, hub, name, status, areaSqm, shareRatio, capitalUnits, incomeUnits, priceUsd } = holding;

  return (
    <article className="group overflow-hidden rounded-lg border border-border bg-card">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        {heroImageId ? (
          <Image
            src={capsuleImageUrl(heroImageId)}
            alt={`${name}, ${hub}`}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex items-end p-5">
            <span className="font-heading text-2xl tracking-tight text-muted-foreground/40">{hub}</span>
          </div>
        )}

        <span className="absolute left-3 top-3 rounded-full bg-background/80 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-foreground backdrop-blur-sm">
          {STATUS_LABEL[status]}
        </span>
      </div>

      <div className="flex flex-col gap-3 p-5">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            {hub} · Phase {holding.phase}
          </p>
          <h3 className="font-heading text-xl font-semibold tracking-tight text-foreground">{name}</h3>
          <p className="text-xs text-muted-foreground">
            {areaSqm} m² · {shareRatio} split
          </p>
        </div>

        {showFigures ? (
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border">
            <div className="flex flex-col gap-0.5 bg-card p-3">
              <dt className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Your units</dt>
              {/* capital + income units ARE the position. Never multiply by price. */}
              <dd className="font-heading text-lg tabular-nums text-foreground">
                {formatGhs(capitalUnits + incomeUnits)}
              </dd>
            </div>
            <div className="flex flex-col gap-0.5 bg-card p-3">
              <dt className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Unit price</dt>
              <dd className="font-heading text-lg tabular-nums text-foreground">{formatUsd(priceUsd)}</dd>
            </div>
          </dl>
        ) : null}
      </div>
    </article>
  );
}
