import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "About | Swift Horizon",
  description: "Why Swift Horizon exists: certainty, craft, and a better model for modular hospitality in Ghana.",
};

const ledgerItems = [
  { label: "Capsule", value: "38 m²", note: "nine-layer wall system, CIGS solar-ready" },
  { label: "Entry", value: "$50,000" },
  { label: "Share", value: "70 / 30" },
  { label: "Lock-in", value: "5 years" },
  { label: "Hubs", value: "4", note: "Oyarifa · Kumasi · Tamale · Takoradi" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80 mb-4">
              About Swift Horizon
            </p>
            <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-6">
              Certainty, craft, and a better model.
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Modular construction removes the schedule risk that kills hospitality builds. A single
              operator removes the split-incentive that complicates ownership. The briefing removes
              the guesswork.
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
                A project kept deliberately small and legible.
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                Everything in Swift Horizon is built to be explained in one conversation — and
                written down for the dossier.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                {ledgerItems.map((item) => (
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
                <a href="/briefing">Request a briefing</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-muted/30 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 items-center max-w-4xl mx-auto">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80 mb-4">
                Contact
              </p>
              <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-foreground mb-4">
                Speak with the operator, not a booth.
              </h2>
              <p className="text-lg text-muted-foreground max-w-md mb-8">
                20 Edmonton St, Madina, Accra. Calls and briefings are handled by the project team
                directly.
              </p>
            </div>
            <div className="border-t border-border pt-8">
              <div className="space-y-4">
                <div className="flex justify-between py-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
                    Ghana
                  </span>
                  <a href="tel:+233544101016" className="font-medium text-foreground hover:text-primary transition-colors">
                    +233 544 101016
                  </a>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
                    North America
                  </span>
                  <a href="tel:+14374210963" className="font-medium text-foreground hover:text-primary transition-colors">
                    +1 437 421 0963
                  </a>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
                    Email
                  </span>
                  <a href="mailto:info@swiftholdings.org" className="font-medium text-foreground hover:text-primary transition-colors">
                    info@swiftholdings.org
                  </a>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
                    Partnerships
                  </span>
                  <a href="mailto:partnerships@swiftholdings-ghana.com" className="font-medium text-foreground hover:text-primary transition-colors">
                    partnerships@swiftholdings-ghana.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}