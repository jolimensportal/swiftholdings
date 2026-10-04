import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "The Village | Swift Horizon",
  description: "Your residence is private. The life around it is shared. Explore the Swift Horizon village.",
};

export default function VillagePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80 mb-4">
              The Village
            </p>
            <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-6">
              Capsules in common, land held in common.
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Owner-investors hold the capsule; the village holds the land. Shared walls, shared
              infrastructure, and a calmer rhythm than the city core — a compound, not a complex.
            </p>
          </div>
        </div>
      </section>

      {/* Village Image */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="aspect-[4/3] bg-muted/50 rounded-2xl flex items-center justify-center max-w-4xl mx-auto">
            <p className="text-muted-foreground">Village aerial illustration</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-y border-border py-16 lg:py-24">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80 mb-4">
            Private briefing
          </p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-foreground mb-5">
            Bring your plans to the conversation.
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-8 text-muted-foreground">
            A private briefing is the place to ask about the village, local context,
            and the details that matter to you.
          </p>
          <a href="/briefing" className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors mt-10">
            Request a private briefing
          </a>
        </div>
      </section>
    </div>
  );
}