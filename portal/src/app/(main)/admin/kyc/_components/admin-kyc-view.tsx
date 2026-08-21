import { Card, CardContent } from "@/components/ui/card";
import { kycQueue } from "@/data/admin";

const tone = (s: string) => (s === "pending" ? "text-amber-400" : "text-sky-400");

export function AdminKycView() {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs uppercase tracking-[0.22em] text-primary/75">Review queue · {kycQueue.length} open</p>
      <Card>
        <CardContent className="pt-6">
          <div className="divide-y divide-border">
            {kycQueue.map((k) => (
              <div
                key={k.id}
                className="grid grid-cols-[1.4fr_1.6fr_1fr_auto] items-center gap-2 py-3 text-sm"
              >
                <div>
                  <p className="text-foreground/80">{k.member}</p>
                  <p className="text-xs text-muted-foreground">{k.id}</p>
                </div>
                <span className="text-muted-foreground">{k.document}</span>
                <span className="text-xs text-muted-foreground">{k.submitted}</span>
                <span className={`text-xs ${tone(k.status)}`}>{k.status}</span>
              </div>
            ))}
          </div>
          <p className="pt-4 text-xs text-muted-foreground">
            Approve or request more documents — verification is simulated for the demo.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
