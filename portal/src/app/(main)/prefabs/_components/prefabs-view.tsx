import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { fundedUnit, prefabCatalog } from "@/data/portal";

const currency = (n: number) => `GHS ${n.toLocaleString("en-US")}`;

function StatusBadge({ status }: { status: string }) {
  if (status === "Funding open") {
    return (
      <Badge className="bg-primary text-primary-foreground hover:bg-primary">Funding open</Badge>
    );
  }
  return (
    <Badge variant="outline" className="border-foreground/30 text-foreground/70">
      {status}
    </Badge>
  );
}

export function PrefabsView() {
  const flagship = prefabCatalog[0];
  const pct = (p: (typeof prefabCatalog)[number]) =>
    Math.round((p.funded / p.units) * 100);

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-[0.28em] text-primary">The Prefab Village</p>
        <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Prefab Projects
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          Pre-built homes funded together by members. You own a funded unit in every project you
          back — across four hubs from Accra to Takoradi.
        </p>
      </header>

      {/* Hero */}
      <div
        className="relative flex min-h-[340px] items-end overflow-hidden rounded-2xl border border-primary/20"
        style={{ backgroundImage: `url(${flagship.image})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/10" />
        <div className="relative z-10 max-w-lg p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-primary">
            {flagship.location}
          </p>
          <h2 className="mt-1 font-heading text-3xl text-foreground sm:text-4xl">{flagship.name}</h2>
          <div className="mt-4 flex gap-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Units</p>
              <p className="text-base font-semibold text-foreground">{flagship.units}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Entry</p>
              <p className="text-base font-semibold text-foreground">{currency(flagship.price)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Status</p>
              <p className="text-base font-semibold text-primary">{flagship.status}</p>
            </div>
          </div>
          <Button asChild size="sm" className="mt-5">
            <a href="#catalog">View project</a>
          </Button>
        </div>
      </div>

      {/* Your funded unit */}
      <section className="flex flex-col gap-4">
        <h3 className="flex items-baseline gap-3 font-heading text-2xl text-foreground">
          Your funded unit <span className="text-xs font-normal text-muted-foreground">Plot 14 · Meridian</span>
        </h3>
        <Card className="overflow-hidden border-primary/30">
          <div className="grid md:grid-cols-[320px_1fr]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/prefabs/prefab_1_3820x2470.jpg"
              alt=""
              className="h-56 w-full object-cover md:h-full"
            />
            <CardContent className="flex flex-col gap-4 p-6">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary">
                  {fundedUnit.phase} · In progress
                </p>
                <h4 className="mt-1 font-heading text-2xl text-foreground">{fundedUnit.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Plot 14 · 1 of 48 units in Phase 1
                </p>
              </div>
              <div>
                <div className="mb-1.5 flex justify-between text-xs">
                  <span className="text-muted-foreground">Construction progress</span>
                  <span className="font-medium tabular-nums text-foreground">
                    {fundedUnit.progress}%
                  </span>
                </div>
                <Progress value={fundedUnit.progress} className="h-1.5 bg-foreground/10" />
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-lg bg-background/60 p-3">
                  <p className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Phase</p>
                  <p className="mt-1 font-semibold text-foreground">{fundedUnit.phase}</p>
                </div>
                <div className="rounded-lg bg-background/60 p-3">
                  <p className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Foundation</p>
                  <p className="mt-1 font-semibold text-foreground">{fundedUnit.foundation}</p>
                </div>
                <div className="rounded-lg bg-background/60 p-3">
                  <p className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Handover</p>
                  <p className="mt-1 font-semibold text-foreground">{fundedUnit.eta}</p>
                </div>
                <div className="rounded-lg bg-background/60 p-3">
                  <p className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Funding</p>
                  <p className="mt-1 font-semibold text-foreground">GHS 50,000</p>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </section>

      {/* Catalog */}
      <section id="catalog" className="flex flex-col gap-4">
        <h3 className="flex items-baseline gap-3 font-heading text-2xl text-foreground">
          All prefab projects{" "}
          <span className="text-xs font-normal text-muted-foreground">
            {prefabCatalog.length} projects · 4 hubs
          </span>
        </h3>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {prefabCatalog.map((p) => (
            <Card key={p.id} className="overflow-hidden border-primary/15">
              <div className="relative h-40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                <div className="absolute right-3 top-3">
                  <StatusBadge status={p.status} />
                </div>
              </div>
              <CardContent className="flex flex-col gap-3 p-4">
                <div>
                  <h4 className="font-heading text-xl text-foreground">{p.name}</h4>
                  <p className="text-xs text-muted-foreground">{p.type}</p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Entry</span>
                  <span className="font-semibold tabular-nums text-foreground">
                    {currency(p.price)}
                  </span>
                </div>
                <div>
                  <Progress value={pct(p)} className="h-1.5 bg-foreground/10" />
                  <div className="mt-1.5 flex justify-between text-xs text-muted-foreground">
                    <span>
                      {p.funded} of {p.units} funded
                    </span>
                    <span className="tabular-nums">{pct(p)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
