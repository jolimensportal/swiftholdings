import { Download } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fundedUnit, statements } from "@/data/portal";

export default function StatementsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Units &amp; Statements</h1>
        <p className="text-muted-foreground text-sm">
          Your funded unit and quarterly statements of account.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Funded unit</CardTitle>
            <CardDescription>Capital allocation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Plot</span>
              <span className="font-medium tabular-nums">{fundedUnit.plot}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Home</span>
              <span className="font-medium">{fundedUnit.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Phase</span>
              <span className="font-medium">{fundedUnit.phase}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Entry value</span>
              <span className="font-semibold tabular-nums">GHS 50,000</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium tabular-nums">{fundedUnit.progress}%</span>
            </div>
            <Progress value={fundedUnit.progress} className="h-1.5 bg-foreground/10" />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Statements of account</CardTitle>
            <CardDescription>Quarterly income and capital movements</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Income</TableHead>
                  <TableHead>Capital</TableHead>
                  <TableHead className="hidden md:table-cell">Yield</TableHead>
                  <TableHead className="hidden sm:table-cell">Date paid</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statements.map((s) => (
                  <TableRow key={s.period}>
                    <TableCell className="font-medium">{s.period}</TableCell>
                    <TableCell className="tabular-nums">{s.income}</TableCell>
                    <TableCell className="tabular-nums">{s.capital}</TableCell>
                    <TableCell className="hidden tabular-nums md:table-cell">{s.yield}</TableCell>
                    <TableCell className="hidden text-muted-foreground sm:table-cell">
                      {s.paid}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={s.status === "Paid" ? "default" : "secondary"}
                        className={
                          s.status === "Paid"
                            ? "bg-green-500/10 text-green-700 dark:bg-green-500/15 dark:text-green-300"
                            : ""
                        }
                      >
                        {s.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm">
                <Download className="size-4" />
                Download statements (PDF)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}