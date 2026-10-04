import { redirect } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { getAdminMembers, getAdminOverview } from "@/server/swift-api";

const kycTone = (k: string) =>
  k === "approved"
    ? "text-emerald-400"
    : k === "pending"
      ? "text-amber-400"
      : k === "rejected"
        ? "text-red-400"
        : "text-sky-400";

export async function AdminMembersView() {
  const overview = await getAdminOverview();
  if (!overview) redirect("/login");

  const members = await getAdminMembers();
  const verified = members.filter((m) => m.kycStatus === "approved").length;

  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs uppercase tracking-[0.22em] text-primary/75">
        Members · {overview.counts.members} total · {verified} KYC verified
      </p>

      <Card>
        <CardContent className="pt-6">
          <div className="divide-y divide-border">
            {members.map((m) => (
              <div
                key={m.id}
                className="grid grid-cols-[1.4fr_1fr_0.6fr_0.8fr_auto] items-center gap-2 py-3 text-sm"
              >
                <span className="truncate text-foreground">{m.name}</span>
                <span className="truncate text-muted-foreground">{m.email}</span>
                <span className="text-muted-foreground">{m.segment}</span>
                <span className={kycTone(m.kycStatus)}>{m.kycStatus}</span>
                <span className="text-muted-foreground">{m.tier}</span>
              </div>
            ))}
            {members.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">No members yet.</p>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}