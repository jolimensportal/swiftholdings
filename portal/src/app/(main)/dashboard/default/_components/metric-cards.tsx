import { DollarSign, TrendingDown, TrendingUp, UserPlus, Users, Waves } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function MetricCards() {
  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs xl:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
              <DollarSign className="size-4" />
            </div>
          </CardTitle>
          <CardDescription>Gross Revenue (30d)</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">GHS 51,400</div>
            <Badge>
              <TrendingUp className="size-3" />
              +12.5%
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">88% occ · $132 ADR · 70/30 share</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
              <UserPlus className="size-4" />
            </div>
          </CardTitle>
          <CardDescription>Occupancy</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">88%</div>
            <Badge>
              <TrendingUp className="size-3" />
              +4.5%
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">Market 33–44% · Accra 300k deficit</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
              <Users className="size-4" />
            </div>
          </CardTitle>
          <CardDescription>Funded Capsules</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">26 / 96</div>
            <Badge>
              <TrendingUp className="size-3" />
              +8
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">Oyarifa 18 · Kumasi 4 · Tamale 2 · Takoradi 2</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
              <Waves className="size-4" />
            </div>
          </CardTitle>
          <CardDescription>Annualised Yield</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">9.4%</div>
            <Badge>
              <TrendingUp className="size-3" />
              +2.2%
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">GHS 2,998 paid 30 Jun 2026</p>
        </CardContent>
      </Card>
    </div>
  );
}
