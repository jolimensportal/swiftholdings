import { redirect } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { getAdminMembers, getAdminOverview } from "@/server/swift-api";

export async function AdminKycView() {
  const overview = await getAdminOverview();
  if (!overview) redirect("/login");

  const members = await getAdminMembers();
  const queue = overview.kycQueue;
  const byStatus = members.reduce<Record<string, number>>((acc, m) => {
    acc[m.kycStatus] = (acc[m.kycStatus] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs uppercase tracking-[0.22em] text-primary/75">
        KYC · {overview.counts.pendingKyc} awaiting review
      </p>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {(["approved", "pending", "needs_info", "rejected"] as const).map((status) => (
          <Card key={status}>
            <CardContent className="flex flex-col gap-1 p-5">
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {status.replace("_", " ")}
              </p>
              <p className="font-heading text-2xl text-foreground">{byStatus[status] ?? 0}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <p className="text-xs uppercase tracking-[0.18em] text-primary">Review queue</p>
          <div className="mt-3 divide-y divide-border">
            {queue.map((k) => (
              <div
                key={k.id}
                className="grid grid-cols-[1.4fr_0.8fr_0.8fr] items-center gap-2 py-3 text-sm"
              >
                <span className="truncate text-foreground">{k.memberId}</span>
                <span className="text-muted-foreground">{k.status}</span>
                <span className="text-muted-foreground">
                  {new Date(k.submittedAt).toLocaleDateString("en-GB")}
                </span>
              </div>
            ))}
            {queue.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">Nothing awaiting review.</p>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}