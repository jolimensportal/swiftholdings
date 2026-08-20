import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { allocation, netWorthSeries, portfolio } from "@/data/portal";

import { PortfolioChart } from "../_components/portfolio-chart";

const holdings = [
  { label: "Capital Units", value: "GHS 89,180", share: "70%", detail: "Funding Phase 1 · Plot 14" },
  { label: "Income Units", value: "GHS 38,220", share: "30%", detail: "Quarterly distributions" },
];

export default function PortfolioPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">My Portfolio</h1>
        <p className="text-muted-foreground text-sm">
          GHS {portfolio.value.toLocaleString()} funded value · {portfolio.yield}% annualised yield
          · Lock-in Year {portfolio.lockInYear} of {portfolio.lockInTotal}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Portfolio growth</CardTitle>
            <CardDescription>Funded value over time</CardDescription>
          </CardHeader>
          <CardContent>
            <PortfolioChart data={netWorthSeries} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Allocation</CardTitle>
            <CardDescription>Capital / income split</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
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
                    <span className="font-medium tabular-nums">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Holdings</CardTitle>
          <CardDescription>Breakdown of your funded units</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unit</TableHead>
                <TableHead>Share</TableHead>
                <TableHead className="text-right">Funded value</TableHead>
                <TableHead className="hidden md:table-cell">Detail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holdings.map((h) => (
                <TableRow key={h.label}>
                  <TableCell className="font-medium">{h.label}</TableCell>
                  <TableCell>{h.share}</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">{h.value}</TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {h.detail}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}