import { redirect } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

import { formatGhs, formatUsd, getAdminCapsules, getAdminOverview } from "@/server/swift-api";

const statusTone = (s: string) =>
  s === "in-revenue"
    ? "text-emerald-400"
    : s === "completed"
      ? "text-sky-400"
      : "text-amber-400";

export async function AdminCapsulesView() {
  const overview = await getAdminOverview();
  if (!overview) redirect("/login");

  const capsules = await getAdminCapsules();
  const inRevenue = capsules.filter((c) => c.status === "in-revenue").length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.22em] text-primary/75">
          Capsules · {capsules.length} total · {inRevenue} in revenue
        </p>
        <Link
          href="/admin/capsules/onboard"
          className="rounded bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
        >
          Onboard a prefab
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="divide-y divide-border">
            {capsules.map((c) => (
              <div
                key={c.id}
                className="grid grid-cols-[1.3fr_0.7fr_0.5fr_0.6fr_0.6fr_auto] items-center gap-2 py-3 text-sm"
              >
                <span className="truncate">
                  <span className="text-foreground">{c.name}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{c.id}</span>
                </span>
                <span className="text-muted-foreground">{c.hub}</span>
                <span className="text-muted-foreground">Phase {c.phase}</span>
                <span className="text-muted-foreground">{formatUsd(c.priceUsd)}</span>
                <span className="text-muted-foreground">{formatGhs(c.capitalUnits)}</span>
                <span className={statusTone(c.status)}>{c.status}</span>
              </div>
            ))}
            {capsules.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">No capsules recorded.</p>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Metric label="Gross revenue" value={formatUsd(overview.revenue.grossUsd)} />
        <Metric label="Owner share" value={formatUsd(overview.revenue.ownerShareUsd)} />
        <Metric label="Hubs" value={String(overview.hubs.length)} />
        <Metric label="Active listings" value={String(overview.counts.activeListings)} />
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-1 p-5">
        <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
        <p className="font-heading text-2xl text-foreground">{value}</p>
      </CardContent>
    </Card>
  );
}