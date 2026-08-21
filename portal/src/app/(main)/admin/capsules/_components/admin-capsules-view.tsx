import { Card, CardContent } from "@/components/ui/card";
import { capsules, segmentLabel } from "@/data/admin";

const statusTone = (s: string) =>
  s === "in-revenue" ? "text-emerald-400" : s === "building" ? "text-sky-400" : "text-amber-400";

export function AdminCapsulesView() {
  const inRevenue = capsules.filter((c) => c.status === "in-revenue").length;
  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs uppercase tracking-[0.22em] text-primary/75">
        Capsules · {capsules.length} total · {inRevenue} in revenue
      </p>
      <div className="grid gap-4 lg:grid-cols-2">
        {capsules.map((c) => (
          <Card key={c.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">{c.name}</p>
                <span className={`text-xs ${statusTone(c.status)}`}>{c.status}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {c.id} · {c.location} · {segmentLabel(c.segment)}
              </p>
              <p className="pt-2 text-xs text-muted-foreground">Owner — {c.owner}</p>
              <div className="mt-3 flex gap-6 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-primary/70">Occupancy</p>
                  <p className="tabular-nums text-foreground">{c.occupancy}%</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-primary/70">Gross/mo</p>
                  <p className="tabular-nums text-foreground">${c.grossMonthly}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
