import { redirect } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { getPortalData, getViewer } from "@/server/swift-api";

export async function ProfileView() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  if (viewer.kind === "admin") redirect("/admin/members");
  const data = await getPortalData();
  if (!data) redirect("/login");

  const { member, portfolio } = data;

  const kycTone: Record<string, string> = {
    approved: "bg-primary/15 text-primary",
    pending: "bg-muted text-muted-foreground",
    needs_info: "bg-muted text-muted-foreground",
    rejected: "bg-destructive/15 text-destructive",
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-[0.28em] text-primary">Profile</p>
        <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {member.name}
        </h1>
      </header>

      <Card className="p-0">
        <CardContent className="py-2">
          <Row label="Email" value={member.email} />
          <Row label="Member ID" value={member.id} />
          <Row label="Investor profile" value={member.segment} />
          <Row label="Tier" value={member.tier} />
          <Row
            label="Identity check"
            value={member.kycStatus}
            badge={kycTone[member.kycStatus] ?? "bg-muted text-muted-foreground"}
          />
          <Row label="Capsules held" value={String(portfolio.capsuleCount)} />
        </CardContent>
      </Card>

      <Card className="border-primary/15 bg-primary/5">
        <CardContent className="py-4 text-sm text-muted-foreground">
          Tier, identity status and capsule allocation are set by Swift Holdings and cannot be
          changed from here. Contact your relationship lead to update your details.
        </CardContent>
      </Card>
    </div>
  );
}

function Row({
  label,
  value,
  badge,
}: {
  label: string;
  value: string;
  badge?: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border py-3 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      {badge ? (
        <span className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.14em] ${badge}`}>
          {value}
        </span>
      ) : (
        <span className="text-foreground">{value}</span>
      )}
    </div>
  );
}