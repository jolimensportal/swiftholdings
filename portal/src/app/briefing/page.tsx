import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Private Briefing | Swift Horizon",
  description: "Request a private briefing with the Swift Horizon team. No pressure, just structured conversation.",
};

export default function BriefingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80 mb-4">
              Private Briefing
            </p>
            <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-6">
              You don&apos;t need to decide today. You need enough information to decide well.
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              No checkout. No countdown timer. No pressure on the call. Just a structured
              conversation about whether this fits the life you&apos;re building.
            </p>
            <Button asChild size="lg">
              <Link href="/contact">Request a private briefing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80 mb-4">
              What to expect
            </p>
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-foreground mb-6">
              A structured conversation, not a sales pitch.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The briefing is where you examine the assumptions, the numbers, and the risks — so
              you can decide with clarity.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">1. The model, explained</CardTitle>
                <p className="text-muted-foreground text-sm">
                  70/30 share, 5-year lock-in, monthly GHS settlement — every line explained.
                </p>
              </CardHeader>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">2. The assumptions</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Base case, stronger case, downside case — every variable documented and defended.
                </p>
              </CardHeader>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">3. Your questions</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Village context, local team, exit mechanics, tax — whatever you need to decide.
                </p>
              </CardHeader>
            </Card>
          </div>

          <div className="text-center mt-10">
            <p className="text-2xl italic text-foreground/70 max-w-2xl mx-auto mb-8">
              No checkout. No countdown timer. No pressure on the call. Just a structured
              conversation about whether this fits the life you&apos;re building.
            </p>
            <Button asChild size="lg">
              <Link href="/contact">Request a private briefing</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}