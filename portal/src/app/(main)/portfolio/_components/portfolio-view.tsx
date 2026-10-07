import { redirect } from "next/navigation";

import { CapsulePlate } from "@/components/capsule-plate";
import { Card, CardContent } from "@/components/ui/card";
import { formatGhs, formatUsd, getPortalData, getViewer } from "@/server/swift-api";

const monthLabel = (ym: string) => {
  const [year, month] = ym.split("-");
  if (!year || !month) return ym;
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
};

export async function PortfolioView() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  // Admins have no member record; send them to their console.
  if (viewer.kind === "admin") redirect("/admin/members");

  const data = await getPortalData();

  if (!data) redirect("/login");

  const { portfolio, holdings, statements } = data;
  const inRevenue = holdings.filter((h) => h.status === "in-revenue");
  const inBuild = holdings.filter((h) => h.status !== "in-revenue");

  const lifetimePaid = statements.filter((s) => s.status === "paid").reduce((sum, s) => sum + s.ownerShareUsd, 0);

  const latest = statements[0];

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-[0.28em] text-primary">My holdings</p>
        <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">My Portfolio</h1>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          {holdings.length === 0
            ? "No capsule is allocated to you yet. Once one is, your position and distributions appear here."
            : `${holdings.length === 1 ? "One capsule is" : `${holdings.length} capsules are`} allocated to you, with your share of each.`}
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-primary/15">
          <CardContent className="flex flex-col gap-1 p-5">
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Portfolio value</p>
            {/* capital + income units ARE the member's position. Never multiply by
                the capsule price — price is a separate USD figure. */}
            <p className="font-heading text-3xl text-primary">
              {formatGhs(portfolio.capitalUnits + portfolio.incomeUnits)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/15">
          <CardContent className="flex flex-col gap-1 p-5">
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Latest distribution</p>
            <p className="font-heading text-3xl text-foreground">{latest ? formatUsd(latest.ownerShareUsd) : "—"}</p>
            {latest ? (
              <p className="text-xs text-muted-foreground">{monthLabel(latest.month)}</p>
            ) : (
              <p className="text-xs text-muted-foreground">No statements yet</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-primary/15">
          <CardContent className="flex flex-col gap-1 p-5">
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Paid to date</p>
            <p className="font-heading text-3xl text-foreground">{formatUsd(lifetimePaid)}</p>
          </CardContent>
        </Card>
      </div>

      {inRevenue.length > 0 ? (
        <section className="flex flex-col gap-4">
          <p className="text-xs uppercase tracking-[0.2em] text-primary">In revenue</p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {inRevenue.map((h) => (
              <CapsulePlate key={h.capsuleId} holding={h} />
            ))}
          </div>
        </section>
      ) : null}

      {inBuild.length > 0 ? (
        <section className="flex flex-col gap-4">
          <p className="text-xs uppercase tracking-[0.2em] text-primary">In build</p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {inBuild.map((h) => (
              <CapsulePlate key={h.capsuleId} holding={h} />
            ))}
          </div>
        </section>
      ) : null}

      {statements.length > 0 ? (
        <section className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Statements</p>
          <Card className="p-0">
            <CardContent className="py-2">
              {statements.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between border-b border-border py-2.5 text-sm last:border-0"
                >
                  <span className="text-muted-foreground">{monthLabel(s.month)}</span>
                  <span className="flex items-center gap-4">
                    <span
                      className={`text-xs uppercase tracking-[0.12em] ${
                        s.status === "paid" ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {s.status}
                    </span>
                    <span className="tabular-nums text-foreground">{formatUsd(s.ownerShareUsd)}</span>
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      ) : null}
    </div>
  );
}
