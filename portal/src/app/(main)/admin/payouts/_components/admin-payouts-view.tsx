import { Card, CardContent } from "@/components/ui/card";
import { payouts } from "@/data/admin";

const statusTone = (s: string) =>
  s === "settled" ? "text-emerald-400" : s === "processing" ? "text-sky-400" : "text-amber-400";

const currency = (n: number, code: string) => (n === 0 ? "—" : `${code} ${n.toLocaleString()}`);

export function AdminPayoutsView() {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs uppercase tracking-[0.22em] text-primary/75">Payout runs · most recent first</p>
      <Card>
        <CardContent className="pt-6">
          <div className="divide-y divide-border">
            {payouts.map((p) => (
              <div
                key={p.id}
                className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] items-center gap-2 py-3 text-sm"
              >
                <div>
                  <p className="text-foreground/80">{p.member}</p>
                  <p className="text-xs text-muted-foreground">{p.period}</p>
                </div>
                <span className="tabular-nums text-foreground/70">{currency(p.usd, "USD")}</span>
                <span className="tabular-nums text-foreground/70">{currency(p.ghs, "GHS")}</span>
                <span className={`text-xs ${statusTone(p.status)}`}>{p.status}</span>
                <span className="text-right text-xs text-muted-foreground">{p.id}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
