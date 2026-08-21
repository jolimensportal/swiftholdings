import { Card, CardContent } from "@/components/ui/card";
import { currentTenant, tenantStats, upcomingTenants } from "@/data/member-portal";

const currency = (n: number) => `$${n}`;

export function TenantsView() {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs uppercase tracking-[0.22em] text-primary/75">
        Tenants · {tenantStats.staysThisMonth} stays this month · {tenantStats.occupancy}% occupancy
      </p>

      <Card className="flex items-center gap-4 p-0">
        <div className="flex size-11 items-center justify-center rounded-full border border-primary/50 font-heading text-lg text-primary">
          {currentTenant.name.split(" ").map((p) => p[0]).join("")}
        </div>
        <CardContent className="flex flex-1 items-center justify-between py-4">
          <div>
            <p className="text-sm font-medium text-foreground">
              {currentTenant.name}{" "}
              <span className="font-normal text-muted-foreground">— {currentTenant.origin}</span>
            </p>
            <p className="text-xs text-muted-foreground">{currentTenant.detail}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.22em] text-primary/90">Checked in</p>
            <p className="text-sm tabular-nums text-muted-foreground">{currency(currentTenant.rate)} / night</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <p className="mb-2 text-xs uppercase tracking-[0.22em] text-primary/75">Upcoming</p>
            <div className="divide-y divide-border">
              {upcomingTenants.map((t) => (
                <div key={t.name} className="grid grid-cols-[1.2fr_1fr_auto] py-3 text-sm">
                  <span className="text-foreground/80">{t.name}</span>
                  <span className="text-muted-foreground">{t.origin}</span>
                  <span className="text-right tabular-nums text-foreground/60">{currency(t.rate)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="mb-2 text-xs uppercase tracking-[0.22em] text-primary/75">This month</p>
            <Row label="Nights sold" value={tenantStats.nightsSold} />
            <Row label="Experiential — ~two-thirds" value={tenantStats.experiential} />
            <Row label="Avg. booking window" value={tenantStats.avgWindow} />
            <p className="pt-3 text-xs text-muted-foreground">
              Bookings arrive through the discovery form — stays are set aside for members first.
            </p>
          </CardContent>
        </Card>
      </div>
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
