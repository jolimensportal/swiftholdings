import { redirect } from "next/navigation";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { formatGhs, formatUsd, getPortalData } from "@/server/swift-api";

const monthLabel = (ym: string) => {
  const [year, month] = ym.split("-");
  if (!year || !month) return ym;
  return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
};

export async function DashboardView() {
  const data = await getPortalData();

  if (!data) redirect("/login");

  const { member, portfolio, holdings, statements, documents, briefings } = data;

  const firstName = member.name.split(" ")[0] ?? member.name;
  const upcoming = briefings
    .filter((b) => b.scheduledAt > Date.now())
    .sort((a, b) => a.scheduledAt - b.scheduledAt)[0];

  const latest = statements[0];
  const position = portfolio.capitalUnits + portfolio.incomeUnits;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-primary/75">Dashboard</p>
        <h1 className="font-heading text-3xl text-foreground">Welcome back, {firstName}</h1>
        <div className="mt-4 flex flex-wrap items-end gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-primary/75">Portfolio value</p>
            <p className="font-heading text-5xl text-primary">{formatGhs(position)}</p>
          </div>
          <p className="pb-2 text-sm text-muted-foreground">
            {holdings.length === 0
              ? "No capsule allocated yet"
              : `${holdings.length} ${holdings.length === 1 ? "capsule" : "capsules"} · ${holdings
                  .map((h) => h.hub)
                  .join(" + ")}`}
            <br />
            {member.tier === "owner-investor" ? "Owner-investor · 70/30 split active" : member.tier}
          </p>
        </div>
      </div>

      {member.kycStatus === "pending" ? (
        <Card className="border-primary/25 bg-primary/5">
          <CardContent className="py-4 text-sm">
            Your identity check is still pending. Complete it to unlock statements and the
            document vault.
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Capital units" value={formatGhs(portfolio.capitalUnits)} />
        <Stat label="Income units" value={formatGhs(portfolio.incomeUnits)} />
        <Stat
          label="Latest distribution"
          value={latest ? formatUsd(latest.ownerShareUsd) : "—"}
          hint={latest ? monthLabel(latest.month) : "No statements yet"}
        />
        <Stat label="Documents" value={String(documents.length)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-0">
          <CardContent className="flex flex-col gap-3 py-5">
            <p className="text-xs uppercase tracking-[0.18em] text-primary">Next briefing</p>
            {upcoming ? (
              <>
                <p className="font-heading text-2xl text-foreground">{upcoming.title}</p>
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
          </CardContent>
        </Card>

        <Card className="p-0">
          <CardContent className="flex flex-col gap-3 py-5">
            <p className="text-xs uppercase tracking-[0.18em] text-primary">Quick actions</p>
            <Link
              href="/portfolio"
              className="text-sm text-foreground underline decoration-primary/30 underline-offset-4"
            >
              View holdings & statements
            </Link>
            <Link
              href="/documents"
              className="text-sm text-foreground underline decoration-primary/30 underline-offset-4"
            >
              Open document vault
            </Link>
            <Link
              href="/profile"
              className="text-sm text-foreground underline decoration-primary/30 underline-offset-4"
            >
              Profile & KYC status
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card className="border-primary/15">
      <CardContent className="flex flex-col gap-1 p-5">
        <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
        <p className="font-heading text-2xl text-foreground">{value}</p>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}