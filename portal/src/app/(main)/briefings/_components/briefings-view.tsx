import { Card, CardContent } from "@/components/ui/card";
import { briefings } from "@/data/member-portal";

export function BriefingsView() {
  const [upcoming, ...past] = briefings;
  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs uppercase tracking-[0.22em] text-primary/75">
        Briefings · Shown in GMT · your timezone
      </p>

      <Card className="flex items-center gap-5 p-0">
        <CardContent className="flex flex-1 items-center gap-5 py-5">
          <div className="text-center">
            <p className="font-heading text-2xl text-primary">{upcoming.day}</p>
            <p className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground">{upcoming.month}</p>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{upcoming.title}</p>
            <p className="text-xs text-muted-foreground">{upcoming.meta}</p>
          </div>
          <span className="text-primary">join</span>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <p className="mb-2 text-xs uppercase tracking-[0.22em] text-primary/75">Past</p>
          <div className="divide-y divide-border">
            {past.map((b) => (
              <div key={b.title} className="grid grid-cols-[2fr_1fr_1fr_auto] py-3 text-sm">
                <span className="text-foreground/80">{b.title}</span>
                <span className="text-muted-foreground">
                  {b.day} {b.month}
                </span>
                <span className="text-muted-foreground">{b.meta.split("·")[0].trim()}</span>
                <span className="text-right text-primary">notes · recording</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between py-4 text-sm">
          <span className="text-muted-foreground">
            Every briefing is recorded, summarised, and filed to Documents.
          </span>
          <span className="text-primary">schedule one</span>
        </CardContent>
      </Card>
    </div>
  );
}
