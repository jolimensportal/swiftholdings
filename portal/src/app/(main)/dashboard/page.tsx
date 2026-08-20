import { ArrowRight, Building2, CalendarClock, Landmark } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  allocation,
  fundedUnit,
  member,
  milestones,
  netWorthSeries,
} from "@/data/portal";

import { PortfolioChart } from "../_components/portfolio-chart";

const kpis = [
  {
    label: "Portfolio value",
    value: "GHS 127,400",
    note: "+154% since Feb 2026",
    tone: "positive" as const,
  },
  {
    label: "Annualised yield",
    value: "9.4%",
    note: "Q2 2026 distribution paid",
    tone: "positive" as const,
  },
  {
    label: "Lock-in",
    value: "Year 1 of 5",
    note: "72% of commitment funded",
    tone: "neutral" as const,
  },
  {
    label: "Next distribution",
    value: "30 Sep 2026",
    note: "Q3 2026 · Income units",
    tone: "neutral" as const,
  },
];

function AllocationDonut() {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-around">
      <div
        className="relative size-36 shrink-0 rounded-full"
        style={{
          background: "conic-gradient(var(--chart-1) 0 70%, var(--chart-2) 70% 100%)",
        }}
      >
        <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-card">
          <span className="text-2xl font-semibold tracking-tight">70/30</span>
          <span className="text-muted-foreground text-[11px] uppercase tracking-wide">
            Cap / Inc
          </span>
        </div>
      </div>
      <div className="w-full space-y-2.5 text-sm">
        {allocation.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full" style={{ background: item.color }} />
              <span className="text-muted-foreground">{item.label}</span>
            </div>
            <span className="font-medium tabular-nums">
              {item.label === "Capital Units"
                ? "GHS 89,180"
                : "GHS 38,220"}
            </span>
          </div>
        ))}
        <div className="flex items-center justify-between border-t pt-2.5">
          <span className="text-muted-foreground">Total portfolio</span>
          <span className="font-semibold tabular-nums">GHS 127,400</span>
        </div>
      </div>
    </div>
  );
}

function FundedUnitCard() {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <Building2 className="size-4 text-foreground/60" />
          Your funded unit
        </CardTitle>
        <CardDescription>Plot 14 · Meridian 3-Bed · Phase 1</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-5">
        <div>
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Construction progress</span>
            <span className="font-medium tabular-nums">{fundedUnit.progress}%</span>
          </div>
          <Progress value={fundedUnit.progress} className="h-2 bg-foreground/10" />
          <p className="mt-3 text-xs text-muted-foreground">
            Foundation complete (Q4 2026) · Structure in progress · Handover{" "}
            <span className="font-medium text-foreground/80">{fundedUnit.eta}</span>
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-muted/60 p-3">
            <p className="text-muted-foreground text-xs">Phase funding</p>
            <p className="mt-1 font-semibold tabular-nums">GHS 50,000</p>
          </div>
          <div className="rounded-lg bg-muted/60 p-3">
            <p className="text-muted-foreground text-xs">Share of Phase 1</p>
            <p className="mt-1 font-semibold tabular-nums">1 / 48 units</p>
          </div>
        </div>
        <Button variant="outline" className="w-full" asChild>
          <a href="/prefabs">
            View project
            <ArrowRight className="size-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}

function MilestonesCard() {
  const statusLabel: Record<string, string> = {
    done: "Complete",
    "in-progress": "In progress",
    pending: "Scheduled",
  };
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <Landmark className="size-4 text-foreground/60" />
          Project milestones
        </CardTitle>
        <CardDescription>Meridian · Phase 1 · 48 units</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {milestones.map((m, index) => (
          <div key={m.label} className="flex items-center gap-3 text-sm">
            <span
              className={`flex size-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold ${
                m.status === "done"
                  ? "border-primary bg-primary text-primary-foreground"
                  : m.status === "in-progress"
                    ? "border-primary text-primary"
                    : "border-border text-muted-foreground"
              }`}
            >
              {index + 1}
            </span>
            <span
              className={`flex-1 ${
                m.status === "pending" ? "text-muted-foreground" : "font-medium"
              }`}
            >
              {m.label}
            </span>
            {m.status === "in-progress" && (
              <Badge className="bg-primary/10 text-primary">In progress</Badge>
            )}
            {m.status === "done" && (
              <Badge className="bg-green-500/10 text-green-700 dark:bg-green-500/15 dark:text-green-300">
                Complete
              </Badge>
            )}
            {m.status === "pending" && (
              <span className="text-xs text-muted-foreground">{statusLabel.pending}</span>
            )}
          </div>
        ))}
        <div className="mt-auto">
          <Button variant="outline" className="w-full" asChild>
            <a href="/prefabs">
              View master plan
              <ArrowRight className="size-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {member.greeting}, {member.name.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground text-sm">
          Member {member.memberId} · Here is what is happening with your portfolio today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="p-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                {kpi.label}
              </span>
              <span className="text-2xl font-semibold tracking-tight tabular-nums">
                {kpi.value}
              </span>
              <span
                className={`text-xs ${
                  kpi.tone === "positive" ? "text-green-600" : "text-muted-foreground"
                }`}
              >
                {kpi.note}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Portfolio growth</CardTitle>
            <CardDescription>Total funded value, Feb – Jul 2026</CardDescription>
          </CardHeader>
          <CardContent>
            <PortfolioChart data={netWorthSeries} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <CalendarClock className="size-4 text-foreground/60" />
              Allocation
            </CardTitle>
            <CardDescription>Capital vs income units</CardDescription>
          </CardHeader>
          <CardContent>
            <AllocationDonut />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <FundedUnitCard />
        <MilestonesCard />
      </div>
    </div>
  );
}