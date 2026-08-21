import { Card, CardContent } from "@/components/ui/card";
import { capsules, portfolioValue } from "@/data/member-portal";

const ghs = (n: number) => `GHS ${n.toLocaleString("en-US")}`;

export function PortfolioView() {
  const [oyarifa, tamale] = capsules;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-[0.28em] text-primary">My Prefabs</p>
        <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          My Prefab Holdings
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          The prefab units you own across the village — one in revenue, one in build. You hold a 70
          / 30 share in each.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-primary/15">
          <CardContent className="flex flex-col gap-1 p-5">
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Portfolio value
            </p>
            <p className="font-heading text-3xl text-primary">{ghs(portfolioValue)}</p>
          </CardContent>
        </Card>
        <Card className="border-primary/15">
          <CardContent className="flex flex-col gap-1 p-5">
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Monthly distributions
            </p>
            <p className="font-heading text-3xl text-foreground">
              {ghs(oyarifa.yourShareMonthly ?? 0)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-primary/15">
          <CardContent className="flex flex-col gap-1 p-5">
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Occupancy
            </p>
            <p className="font-heading text-3xl text-foreground">{oyarifa.occupancy}%</p>
          </CardContent>
        </Card>
      </div>

      <section className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-[0.2em] text-primary">In revenue</p>
        <Card className="overflow-hidden p-0">
          <div className="grid lg:grid-cols-[1.35fr_1fr]">
            <div className="relative min-h-80">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={oyarifa.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/10" />
              <span className="absolute right-5 top-4 rounded-full bg-primary/15 px-3 py-1 text-xs uppercase tracking-[0.18em] text-primary">
                In revenue
              </span>
              <div className="absolute bottom-5 left-6">
                <p className="text-xs uppercase tracking-[0.22em] text-primary/90">
                  {oyarifa.id} · {oyarifa.location}
                </p>
                <p className="font-heading text-3xl text-foreground">Your first capsule</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Owned since {oyarifa.ownedSince} · {oyarifa.share} share · fully tenanted
                </p>
              </div>
            </div>
            <CardContent className="flex flex-col gap-3 py-6">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Performance — 90 days
                </span>
                <span className="font-heading text-2xl text-primary">
                  {ghs(oyarifa.performance90d ?? 0)}
                </span>
              </div>
              <Row label="Gross revenue" value={`${ghs(oyarifa.grossMonthly ?? 0)} / mo`} />
              <Row label="Your share — 70%" value={`${ghs(oyarifa.yourShareMonthly ?? 0)} / mo`} />
              <Row label="Occupancy" value={`${oyarifa.occupancy}%`} />
              <div className="pt-1 text-sm text-muted-foreground">
                Block-off dates — yours:{" "}
                <span className="rounded bg-primary/15 px-2 py-1 text-xs text-primary">
                  {oyarifa.blockOff}
                </span>{" "}
                <span className="ml-2 text-xs">+ reserve</span>
              </div>
            </CardContent>
          </div>
        </Card>
      </section>

      <section className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-[0.2em] text-primary">In build</p>
        <Card className="flex items-stretch gap-0 p-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={tamale.image}
            alt=""
            className="h-44 w-40 object-cover sm:h-auto sm:w-64"
          />
          <CardContent className="flex flex-1 items-center justify-between py-5">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-primary/90">
                {tamale.id} · {tamale.location}
              </p>
              <p className="font-heading text-2xl text-foreground">Second capsule</p>
              <p className="text-xs text-muted-foreground">
                Plans completed · awaiting foundation · next payment {tamale.nextPayment}
              </p>
            </div>
            <div className="ml-4 text-right text-xs">
              <p className="uppercase tracking-[0.16em] text-muted-foreground">Price</p>
              <p className="font-heading text-2xl text-foreground">{ghs(tamale.price ?? 0)}</p>
              <p className="mt-2 uppercase tracking-[0.16em] text-muted-foreground">Phase</p>
              <p className="mt-0.5 text-primary">{tamale.phase}</p>
              <p className="mt-2 text-primary">manage →</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card className="flex items-center justify-between border-primary/15 bg-primary/5">
        <CardContent className="flex w-full items-center justify-between py-4">
          <span className="text-sm text-muted-foreground">
            Acquire a new capsule — reserve with a 20% escrow deposit
          </span>
          <span className="font-heading text-xl text-primary">{ghs(50_000)} entry</span>
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
