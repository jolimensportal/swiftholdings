import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatGhs, formatUsd, getPortalData, getViewer } from "@/server/swift-api";

const monthLabel = (ym: string) => {
  const [year, month] = ym.split("-");
  if (!year || !month) return ym;
  return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
};

export default async function StatementsPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  if (viewer.kind === "admin") redirect("/admin/members");
  const data = await getPortalData();
  if (!data) redirect("/login");

  const { statements, holdings } = data;

  const grossTotal = statements.reduce((sum, s) => sum + s.grossUsd, 0);
  const ownerTotal = statements.reduce((sum, s) => sum + s.ownerShareUsd, 0);
  const outstanding = statements.filter((s) => s.status !== "paid").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Units &amp; Statements</h1>
        <p className="text-muted-foreground text-sm">
          Monthly settlement of gross revenue against your 70% share.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Gross revenue to date</CardDescription>
            <CardTitle className="font-heading text-3xl">{formatUsd(grossTotal)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Your share — 70%</CardDescription>
            <CardTitle className="font-heading text-3xl">{formatUsd(ownerTotal)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Outstanding statements</CardDescription>
            <CardTitle className="font-heading text-3xl">{outstanding}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Statement history</CardTitle>
          <CardDescription>One row per settled month.</CardDescription>
        </CardHeader>
        <CardContent>
          {statements.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No statements yet. They are issued once a capsule is in revenue.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Capsule</TableHead>
                  <TableHead className="text-right">Gross</TableHead>
                  <TableHead className="text-right">Your share</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statements.map((s) => {
                  const holding = holdings.find((h) => h.capsuleId === s.capsuleId);
                  return (
                    <TableRow key={s.id}>
                      <TableCell>{monthLabel(s.month)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {holding ? `${holding.hub} · ${holding.name}` : s.capsuleId}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatUsd(s.grossUsd)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatUsd(s.ownerShareUsd)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={s.status === "paid" ? "default" : "secondary"}>
                          {s.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Capital position</CardTitle>
          <CardDescription>
            Capital and income units are your GHS position in the village.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-8">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Capital units
            </p>
            <p className="font-heading text-3xl">
              {formatGhs(
                holdings.reduce((sum, h) => sum + h.capitalUnits, 0),
              )}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Income units
            </p>
            <p className="font-heading text-3xl">
              {formatGhs(holdings.reduce((sum, h) => sum + h.incomeUnits, 0))}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}