import { Card, CardContent } from "@/components/ui/card";
import {
  capsules,
  greetingName,
  nextBriefing,
  portfolioValue,
  revenueLedger,
} from "@/data/member-portal";

const currency = (n: number) => `$${n.toLocaleString("en-US")}`;

export function DashboardView() {
  const [oyarifa] = capsules;
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-primary/75">Dashboard</p>
        <h1 className="font-heading text-3xl text-foreground">Good evening, {greetingName}</h1>
        <div className="mt-4 flex flex-wrap items-end gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-primary/75">Portfolio value</p>
            <p className="font-heading text-5xl text-primary">{currency(portfolioValue)}</p>
          </div>
          <p className="pb-2 text-sm text-muted-foreground">
            Two capsules · Oyarifa + Tamale
            <br />
            70 / 30 revenue share active
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <div className="mb-2 flex justify-between text-xs text-muted-foreground">
              <span>Revenue ledger</span>
              <span>GHS settled monthly · USD held</span>
            </div>
            <div className="divide-y divide-border">
              {revenueLedger.map((row) => (
                <div key={row.month} className="grid grid-cols-4 py-3 text-sm">
                  <span className="text-foreground/80">{row.month}</span>
                  <span className="tabular-nums text-foreground">{currency(row.gross)}</span>
                  <span className="tabular-nums text-primary">{currency(row.share)}</span>
                  <span className="text-right text-xs text-muted-foreground">{row.status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden p-0">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={oyarifa.image} alt="" className="h-40 w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/85 to-transparent p-3">
              <p className="text-xs uppercase tracking-[0.22em] text-primary/90">{oyarifa.id} · Oyarifa</p>
            </div>
          </div>
          <CardContent className="pt-4">
            <div className="flex justify-between py-3 text-sm">
              <span className="text-muted-foreground">Occupancy — 30 days</span>
              <span className="tabular-nums text-foreground">{oyarifa.occupancy}%</span>
            </div>
            <div className="flex justify-between py-3 text-sm">
              <span className="text-muted-foreground">Average daily rate</span>
              <span className="tabular-nums text-foreground">${oyarifa.adr}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="flex items-center justify-between py-4 text-sm">
          <span className="text-muted-foreground">Next — {nextBriefing}</span>
          <span className="text-primary">join</span>
        </CardContent>
      </Card>
    </div>
  );
}
