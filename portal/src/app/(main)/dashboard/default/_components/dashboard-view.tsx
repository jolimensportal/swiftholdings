import { redirect } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { formatGhs, formatUsd, getPortalData, getViewer } from "@/server/swift-api";

const monthLabel = (ym: string) => {
  const [year, month] = ym.split("-");
  if (!year || !month) return ym;
  return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
};

/**
 * The Vitrine: the place leads, the position belongs to it.
 *
 * A member owns capsules, not a balance, so the capsule is the heading and the
 * money sits underneath as belonging to that unit. Serif is Cormorant Garamond
 * for display only — never below 20px — with Manrope carrying every label and
 * control.
 */
export async function DashboardView() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  if (viewer.kind === "admin") redirect("/admin/members");

  const data = await getPortalData();
  if (!data) redirect("/login");

  const { member, portfolio, holdings, statements, documents, briefings } = data;

  const firstName = member.name.split(" ")[0] ?? member.name;
  const upcoming = briefings
    .filter((b) => b.scheduledAt > Date.now())
    .sort((a, b) => a.scheduledAt - b.scheduledAt)[0];

  const latest = statements[0];
  const position = portfolio.capitalUnits + portfolio.incomeUnits;
  const lead = holdings[0];

  return (
    <div className="flex flex-col gap-8">
      {lead ? (
        <header className="flex flex-col gap-2">
          <p className="text-[10px] tracking-[0.24em] text-primary uppercase">
            {lead.hub} · {lead.name}
          </p>
          <h1 className="font-heading text-4xl leading-[1.1] font-medium text-foreground">
            Your capsule {lead.capsuleId}
          </h1>
          <p className="text-sm text-muted-foreground">
            {lead.areaSqm} m² · {lead.shareRatio} · owned since{" "}
            {new Date(lead.ownedSince).toLocaleDateString("en-GB", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </header>
      ) : (
        <header className="flex flex-col gap-2">
          <p className="text-[10px] tracking-[0.24em] text-primary uppercase">Your position</p>
          <h1 className="font-heading text-4xl leading-[1.1] font-medium text-foreground">
            Welcome back, {firstName}
          </h1>
          <p className="text-sm text-muted-foreground">
            No capsule is allocated to you yet. Once one is, it appears here.
          </p>
        </header>
      )}

      {member.kycStatus === "pending" ? (
        <Card className="border-primary/25 bg-primary/5">
          <CardContent className="py-4 text-sm">
            Your identity check is still pending. Complete it to unlock statements and the
            document vault.
          </CardContent>
        </Card>
      ) : null}

      <section className="flex flex-col gap-2">
        <p className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
          Your position
        </p>
        <p className="font-heading text-5xl leading-none text-foreground">
          {formatGhs(position)}
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="text-primary">{formatGhs(portfolio.capitalUnits)}</span> capital ·{" "}
          <span className="text-primary">{formatGhs(portfolio.incomeUnits)}</span> income
        </p>
      </section>

      <div className="grid gap-8 border-t border-border pt-6 lg:grid-cols-2">
        <section className="flex flex-col gap-3">
          <p className="text-[10px] tracking-[0.2em] text-primary uppercase">Settlements</p>
          {statements.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No statements yet. They are issued once a capsule is in revenue.
            </p>
          ) : (
            <div>
              {statements.slice(0, 4).map((s) => (
                <div
                  key={s.id}
                  className="flex items-baseline justify-between border-b border-border py-2.5 last:border-0"
                >
                  <span className="text-sm text-muted-foreground">{monthLabel(s.month)}</span>
                  <span className="flex items-baseline gap-3">
                    <span
                      className={`text-xs tracking-[0.12em] uppercase ${
                        s.status === "paid" ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {s.status}
                    </span>
                    <span className="font-heading text-lg text-foreground">
                      {formatUsd(s.ownerShareUsd)}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="flex flex-col gap-3">
          <p className="text-[10px] tracking-[0.2em] text-primary uppercase">Next briefing</p>
          {upcoming ? (
            <>
              <p className="font-heading text-2xl leading-snug text-foreground">
                {upcoming.title}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(upcoming.scheduledAt).toLocaleString("en-GB", {
                  dateStyle: "medium",
                  timeStyle: "short",
                  timeZone: "GMT",
                })}{" "}
                · {upcoming.durationMin} min
                {upcoming.host ? ` · ${upcoming.host}` : ""}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nothing scheduled. Your next briefing will appear here once booked.
            </p>
          )}

          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <a href="/portfolio" className="text-foreground underline underline-offset-4">
              Holdings
            </a>
            <a href="/documents" className="text-foreground underline underline-offset-4">
              Documents ({documents.length})
            </a>
            <a href="/profile" className="text-foreground underline underline-offset-4">
              Profile
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}