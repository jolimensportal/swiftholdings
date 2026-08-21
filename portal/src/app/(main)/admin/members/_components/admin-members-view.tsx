import { Card, CardContent } from "@/components/ui/card";
import { members, segmentLabel, kycLabel } from "@/data/admin";

const kycTone = (k: string) =>
  k === "Verified" ? "text-emerald-400" : k === "Pending" ? "text-amber-400" : "text-sky-400";

export function AdminMembersView() {
  const verified = members.filter((m) => m.kyc === "verified").length;
  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs uppercase tracking-[0.22em] text-primary/75">
        Members · {members.length} total · {verified} KYC verified
      </p>
      <Card>
        <CardContent className="pt-6">
          <div className="divide-y divide-border">
            {members.map((m) => (
              <div
                key={m.id}
                className="grid grid-cols-[1.4fr_1fr_0.6fr_0.8fr_auto] items-center gap-2 py-3 text-sm"
              >
                <div>
                  <p className="font-medium text-foreground">{m.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {m.origin} · joined {m.joined}
                  </p>
                </div>
                <span className="text-muted-foreground">{segmentLabel(m.segment)}</span>
                <span className="tabular-nums text-foreground/70">{m.capsules} caps</span>
                <span className={`text-xs ${kycTone(kycLabel(m.kyc))}`}>{kycLabel(m.kyc)}</span>
                <span className="text-right text-xs text-muted-foreground">{m.payout}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
