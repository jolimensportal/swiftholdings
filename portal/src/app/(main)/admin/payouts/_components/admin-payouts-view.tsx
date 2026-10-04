import { redirect } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { formatUsd, getAdminOverview } from "@/server/swift-api";

export async function AdminPayoutsView() {
  const overview = await getAdminOverview();
  if (!overview) redirect("/login");

  const { payoutQueue, counts } = overview;

  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs uppercase tracking-[0.22em] text-primary/75">
        Payouts · {counts.pendingPayouts} pending or processing
      </p>

      <Card>
        <CardContent className="pt-6">
          <div className="divide-y divide-border">
            {payoutQueue.map((p) => (
              <div
                key={p.id}
                className="grid grid-cols-[1.4fr_0.8fr_0.7fr_0.7fr] items-center gap-2 py-3 text-sm"
              >
                <span className="truncate text-foreground">{p.memberId}</span>
                <span className="text-muted-foreground">{p.capsuleId}</span>
                <span className="tabular-nums text-foreground">{formatUsd(p.amountUsd)}</span>
                <span className="text-muted-foreground">{p.status}</span>
              </div>
            ))}
            {payoutQueue.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">
                No payouts queued. Payout runs are created when a statement settles.
              </p>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}