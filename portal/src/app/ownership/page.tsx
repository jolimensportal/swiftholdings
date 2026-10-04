import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "Ownership & Financials | Swift Horizon",
  description: "The Swift Horizon ownership model: one entry, one share, one operator. $50,000 entry, 70/30 revenue share, monthly settlement.",
};

const ledgerItems = [
  { label: "Entry", value: "$50,000", note: "one P7 capsule, fully installed" },
  { label: "Revenue share", value: "70 / 30", note: "70% to you, 30% to the operator" },
  { label: "Settlement", value: "Monthly", note: "USD held · GHS settled" },
  { label: "Lock-in", value: "5 years", note: "five phases, one operating partner" },
  { label: "Your capsule", value: "38 m²", note: "nine-layer wall system, CIGS solar-ready" },
];

export default function OwnershipPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80 mb-4">
              Ownership & Financials
            </p>
            <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-6">
              One entry, one share, one operator.
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Swift Horizon keeps the owner path legible. Every capsule follows the same financial
              line.
            </p>
          </div>
        </div>
      </section>

      {/* Market Ledger */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto border-border/50">
            <CardHeader className="text-center mb-8">
              <CardTitle className="text-2xl lg:text-3xl font-semibold tracking-tight text-foreground">
                The owner path
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                Swift Horizon keeps the owner path legible. Every capsule follows the same financial
                line.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: "Entry", value: "$50,000", note: "one P7 capsule, fully installed" },
                  { label: "Revenue share", value: "70 / 30", note: "70% to you, 30% to the operator" },
                  { label: "Settlement", value: "Monthly", note: "USD held · GHS settled" },
                  { label: "Lock-in", value: "5 years", note: "five phases, one operating partner" },
                  { label: "Your capsule", value: "38 m²", note: "nine-layer wall system, CIGS solar-ready" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg border border-border/50 p-4 bg-card/50"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80 mb-1">
                      {item.label}
                    </p>
                    <p className="text-2xl font-semibold text-foreground">{item.value}</p>
                    {item.note && (
                      <p className="text-sm text-muted-foreground mt-1">{item.note}</p>
                    )}
                  </div>
                ))}
              </div>
              <Button asChild className="w-full mt-6">
                <Link href="/protections">See the protections</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Calculator Section Placeholder */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl mx-auto">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Yield Calculator (Preview)</CardTitle>
              <CardDescription className="text-muted-foreground">
                Full calculator available after briefing. Base assumptions shown.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span>Gross monthly (88% @ $132)</span>
                  <span className="font-medium">GHS 51,400</span>
                </div>
                <div className="flex justify-between">
                  <span>Investor share 70%</span>
                  <span className="font-medium">GHS 35,980</span>
                </div>
                <div className="flex justify-between">
                  <span>5-year 350% return (SIM)</span>
                  <span className="font-medium">GATED full scenarios</span>
                </div>
                <div className="flex justify-between">
                  <span>Hub-month matrix (Accra 48 / Kumasi 24 / etc)</span>
                  <span className="font-medium">GATED</span>
                </div>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link href="/briefing">Request full yield table</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Numbers Hold */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 items-center max-w-4xl mx-auto">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80 mb-4">
                Why the numbers hold
              </p>
              <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-foreground mb-5">
                Grounded in documented demand, not optimism.
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl">
                The case rests on the accommodation deficit: over 300,000 rooms short in Accra and
                more than two million across Ghana, with demand growing 6–10% a year. Full
                methodology and hub-month breakdowns are GATED and open after the briefing.
              </p>
            </div>
            <div className="aspect-[4/3] bg-muted/50 rounded-2xl flex items-center justify-center">
              <p className="text-muted-foreground">Ownership story illustration</p>
            </div>
          </div>
        </div>
      </section>

      {/* Portal Preview Placeholder */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                Member Portal Preview
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                See your portfolio, capsules, and revenue in real time.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2 text-sm">
                <div className="rounded-lg border border-border/50 p-4 bg-card/50">
                  <p className="font-medium">Portfolio value: <span className="ml-2 tabular-nums">GHS 127,400</span></p>
                  <p className="text-sm text-muted-foreground">Capital units: 89,180 · Income units: 38,220</p>
                </div>
                <div className="rounded-lg border border-border/50 p-4 bg-card/50">
                  <p className="font-medium">Capsule: <span className="ml-2">P7-012 Meridian</span></p>
                  <p className="text-sm text-muted-foreground">Phase 1 · Oyarifa, Accra · In-revenue</p>
                </div>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link href="/login">Sign in to portal</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/briefing">Request a briefing</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}