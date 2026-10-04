import { redirect } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { formatUsd, getPortalData } from "@/server/swift-api";

const monthLabel = (ym: string) => {
  const [year, month] = ym.split("-");
  if (!year || !month) return ym;
  return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
};

export async function BriefingsView() {
  const data = await getPortalData();
  if (!data) redirect("/login");

  const now = Date.now();
  const upcoming = data.briefings
    .filter((b) => b.scheduledAt >= now)
    .sort((a, b) => a.scheduledAt - b.scheduledAt);
  const past = data.briefings
    .filter((b) => b.scheduledAt < now)
    .sort((a, b) => b.scheduledAt - a.scheduledAt);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-[0.28em] text-primary">Briefings</p>
        <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Your briefings
        </h1>
      </header>

      <Section title="Upcoming" empty="Nothing scheduled.">
        {upcoming.map((b) => (
          <Card key={b.id} className="p-0">
            <CardContent className="flex flex-col gap-1 py-5">
              <p className="text-xs uppercase tracking-[0.16em] text-primary/90">
                {new Date(b.scheduledAt).toLocaleString("en-GB", {
                  dateStyle: "medium",
                  timeStyle: "short",
                  timeZone: "GMT",
                })}{" "}
                GMT · {b.durationMin} min
              </p>
              <p className="font-heading text-2xl text-foreground">{b.title}</p>
              {b.description ? (
                <p className="text-sm text-muted-foreground">{b.description}</p>
              ) : null}
              {b.host ? <p className="text-xs text-muted-foreground">With {b.host}</p> : null}
            </CardContent>
          </Card>
        ))}
      </Section>

      <Section title="Past" empty="No past briefings.">
        {past.map((b) => (
          <Card key={b.id} className="p-0">
            <CardContent className="flex flex-col gap-1 py-5">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                {new Date(b.scheduledAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className="font-heading text-xl text-foreground">{b.title}</p>
              {b.host ? <p className="text-xs text-muted-foreground">With {b.host}</p> : null}
            </CardContent>
          </Card>
        ))}
      </Section>

      <p className="text-xs text-muted-foreground">
        Where a briefing is marked encrypted, the recording and notes are stored privately and
        released to you only.
      </p>
    </div>
  );
}

function Section({
  title,
  empty,
  children,
}: {
  title: string;
  empty: string;
  children: React.ReactNode;
}) {
  const items = Array.isArray(children) ? children : [children];
  const filled = items.filter(Boolean);

  return (
    <section className="flex flex-col gap-3">
      <p className="text-xs uppercase tracking-[0.2em] text-primary">{title}</p>
      {filled.length === 0 ? (
        <Card>
          <CardContent className="py-5 text-sm text-muted-foreground">{empty}</CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">{filled}</div>
      )}
    </section>
  );
}

export { monthLabel, formatUsd };