import { Card, CardContent } from "@/components/ui/card";
import { contentItems } from "@/data/admin";

const tone = (s: string) => (s === "published" ? "text-emerald-400" : "text-amber-400");

export function AdminContentView() {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs uppercase tracking-[0.22em] text-primary/75">Briefings & documents · publish or draft</p>
      <Card>
        <CardContent className="pt-6">
          <div className="divide-y divide-border">
            {contentItems.map((c) => (
              <div
                key={c.id}
                className="grid grid-cols-[1.6fr_0.8fr_0.8fr_auto] items-center gap-2 py-3 text-sm"
              >
                <p className="text-foreground/80">{c.title}</p>
                <span className="text-xs text-muted-foreground">{c.type}</span>
                <span className={`text-xs ${tone(c.status)}`}>{c.status}</span>
                <span className="text-right text-xs text-muted-foreground">{c.date}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
