import { ArrowRight, BadgeCheck, Home } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { fundedUnit, prefabCatalog } from "@/data/portal";

export default function PrefabsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Prefab Projects</h1>
        <p className="text-muted-foreground text-sm">
          Pre-built homes funded together by members. You own a funded unit in every project you
          back.
        </p>
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <BadgeCheck className="size-4 text-primary" />
            Your funded unit
          </CardTitle>
          <CardDescription>
            {fundedUnit.plot} · {fundedUnit.name} · {fundedUnit.phase}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Construction progress</span>
                <span className="font-medium tabular-nums">{fundedUnit.progress}%</span>
              </div>
              <Progress value={fundedUnit.progress} className="h-2 bg-foreground/10" />
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                <div className="rounded-lg bg-background/70 p-3">
                  <p className="text-muted-foreground text-xs">Phase</p>
                  <p className="mt-1 font-semibold">{fundedUnit.phase}</p>
                </div>
                <div className="rounded-lg bg-background/70 p-3">
                  <p className="text-muted-foreground text-xs">Foundation</p>
                  <p className="mt-1 font-semibold tabular-nums">{fundedUnit.foundation}</p>
                </div>
                <div className="rounded-lg bg-background/70 p-3">
                  <p className="text-muted-foreground text-xs">Handover</p>
                  <p className="mt-1 font-semibold tabular-nums">{fundedUnit.eta}</p>
                </div>
                <div className="rounded-lg bg-background/70 p-3">
                  <p className="text-muted-foreground text-xs">Funding</p>
                  <p className="mt-1 font-semibold tabular-nums">GHS 50,000</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between gap-3 rounded-lg border border-dashed border-primary/40 bg-background/70 p-4">
              <div className="flex items-start gap-2">
                <Home className="mt-0.5 size-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">Plot 14, Meridian</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    1 of 48 units in Phase 1. Structure works are in progress; handover is
                    scheduled for {fundedUnit.eta}.
                  </p>
                </div>
              </div>
              <Button size="sm" asChild>
                <a href="/briefings">
                  Read latest briefing
                  <ArrowRight className="size-4" />
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-base font-semibold tracking-tight">All prefab projects</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {prefabCatalog.map((p) => (
            <Card key={p.id} className="flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm font-semibold">{p.name}</CardTitle>
                  <Badge
                    variant={p.status === "Funding open" ? "default" : "secondary"}
                    className={p.status === "Funding open" ? "bg-primary text-primary-foreground" : ""}
                  >
                    {p.status}
                  </Badge>
                </div>
                <CardDescription>{p.type}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-3 text-sm">
                <p className="text-muted-foreground">{p.size}</p>
                <div className="mt-auto space-y-3">
                  <div>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        {p.funded} of {p.units} units funded
                      </span>
                      <span className="font-medium tabular-nums">
                        {Math.round((p.funded / p.units) * 100)}%
                      </span>
                    </div>
                    <Progress value={(p.funded / p.units) * 100} className="h-1.5 bg-foreground/10" />
                  </div>
                  <div className="flex items-center justify-between border-t pt-3">
                    <span className="text-muted-foreground">Entry</span>
                    <span className="font-semibold tabular-nums">GHS {p.price.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}