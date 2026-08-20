import { ArrowRight, Newspaper } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { briefings } from "@/data/portal";

export default function BriefingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Briefings</h1>
        <p className="text-muted-foreground text-sm">
          Construction, distribution, and project announcements for members.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {briefings.map((b, index) => (
          <Card key={b.id} className={index === 0 ? "lg:col-span-3" : ""}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="secondary">{b.category}</Badge>
                <span className="text-xs text-muted-foreground tabular-nums">{b.date}</span>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Newspaper className="size-4 text-muted-foreground" />
                </div>
                <div>
                  <h2 className="font-medium tracking-tight">{b.title}</h2>
                  <p className="mt-1.5 text-sm text-muted-foreground">{b.excerpt}</p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="ghost" size="sm">
                  Read briefing
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}