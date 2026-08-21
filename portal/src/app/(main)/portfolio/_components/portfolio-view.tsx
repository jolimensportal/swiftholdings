import { Card, CardContent } from "@/components/ui/card";
import { capsules } from "@/data/member-portal";

const currency = (n: number) => `$${n.toLocaleString("en-US")}`;

export function PortfolioView() {
  const [oyarifa, tamale] = capsules;
  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs uppercase tracking-[0.22em] text-primary/75">
        Portfolio · 02 units · both in revenue
      </p>

      <Card className="overflow-hidden p-0">
        <div className="grid lg:grid-cols-[1.35fr_1fr]">
          <div className="relative min-h-80">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={oyarifa.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/10" />
            <div className="absolute bottom-5 left-6">
              <p className="text-xs uppercase tracking-[0.22em] text-primary/90">
                {oyarifa.id} · {oyarifa.location}
              </p>
              <p className="font-heading text-3xl text-foreground">Your first capsule</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Owned since {oyarifa.ownedSince} · {oyarifa.share} share · fully tenanted
              </p>
            </div>
            <div className="absolute right-5 top-4 text-xs uppercase tracking-[0.22em] text-primary/90">
              In revenue
            </div>
          </div>
          <CardContent className="flex flex-col gap-4 py-6">
            <div className="flex justify-between">
              <span className="text-xs uppercase tracking-[0.22em] text-primary/75">Performance — 90 days</span>
              <span className="font-heading text-2xl text-primary">{currency(oyarifa.performance90d ?? 0)}</span>
            </div>
            <Row label="Gross revenue" value={`${currency(oyarifa.grossMonthly ?? 0)} / mo`} />
            <Row label="Your share — 70%" value={`${currency(oyarifa.yourShareMonthly ?? 0)} / mo`} />
            <Row label="Occupancy" value={`${oyarifa.occupancy}%`} />
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.22em] text-primary/75">Block-off dates — yours</p>
              <span className="rounded bg-primary/15 px-2 py-1 text-xs text-primary">{oyarifa.blockOff}</span>
              <span className="ml-2 text-xs text-muted-foreground">+ reserve</span>
            </div>
          </CardContent>
        </div>
      </Card>

      <Card className="flex items-center gap-4 p-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={tamale.image} alt="" className="h-24 w-40 object-cover" />
        <CardContent className="flex flex-1 items-center justify-between py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-primary/90">
              {tamale.id} · {tamale.location}
            </p>
            <p className="font-heading text-2xl text-foreground">{currency(tamale.price ?? 0)}</p>
            <p className="text-xs text-muted-foreground">
              Plans completed · awaiting foundation · next payment {tamale.nextPayment}
            </p>
          </div>
          <div className="text-right text-xs">
            <p className="uppercase tracking-[0.22em] text-muted-foreground">{tamale.phase}</p>
            <p className="mt-2 text-primary">manage</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between py-4">
          <span className="text-sm text-muted-foreground">
            Acquire a new capsule — reserve with a 20% escrow deposit
          </span>
          <span className="font-heading text-xl text-primary">$50,000 entry</span>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-border py-2.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums text-foreground">{value}</span>
    </div>
  );
}
