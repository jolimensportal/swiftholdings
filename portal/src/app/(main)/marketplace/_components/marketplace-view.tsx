import { Card, CardContent } from "@/components/ui/card";
import { marketplaceFeatured, marketplaceListings } from "@/data/member-portal";
import { BidBox } from "./bid-box";

const currency = (n: number) => `$${n.toLocaleString("en-US")}`;

export function MarketplaceView() {
  const f = marketplaceFeatured;
  return (
    <div className="flex flex-col gap-0">
      <div className="flex items-baseline justify-between pb-3">
        <p className="text-xs uppercase tracking-[0.22em] text-primary/75">Marketplace — {f.location}</p>
        <p className="text-xs text-muted-foreground">02 / 06 listings open</p>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="grid lg:grid-cols-[1.55fr_1fr]">
          <div className="relative min-h-96 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={f.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/40 to-background/5" />
            <div className="absolute bottom-0 left-0 max-w-sm p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-primary/90">Unit {f.id}</p>
              <p className="font-heading text-4xl text-foreground">{f.title}</p>
              <p className="mt-2 text-sm text-muted-foreground/80">{f.blurb}</p>
            </div>
            <div className="absolute right-5 top-4 text-right">
              <p className="font-heading text-xl text-primary tabular-nums">{f.countdown}</p>
              <p className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground">until close</p>
            </div>
          </div>
          <CardContent className="flex flex-col gap-4 border-l border-border py-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-primary/75">Current bid</p>
                <p className="font-heading text-4xl text-primary">{currency(f.currentBid)}</p>
              </div>
              <p className="text-right text-xs text-muted-foreground">
                reserve {currency(f.reserve)} · {f.reserveMet ? "met" : "not met"}
              </p>
            </div>
            <div className="border-t border-border pt-4">
              <p className="mb-2 text-xs text-muted-foreground">{f.bids.length + 4} bids</p>
              <div className="flex flex-col gap-2">
                {f.bids.map((b) => (
                  <div key={b.bidder} className="flex justify-between text-sm">
                    <span className={b.you ? "text-primary" : "text-foreground/80"}>
                      {currency(b.amount)} {b.you && <span className="text-muted-foreground">— you</span>}
                    </span>
                    <span className="text-xs text-muted-foreground">{b.time}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-auto">
              <BidBox defaultBid={f.defaultBid} minIncrement={f.minIncrement} />
            </div>
          </CardContent>
        </div>
      </Card>

      <div className="grid border-t border-border sm:grid-cols-2">
        {marketplaceListings.map((l) => (
          <div
            key={l.id}
            className="flex gap-4 p-5 sm:odd:border-r sm:odd:border-border"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={l.image} alt="" className="h-20 w-28 rounded object-cover" />
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-primary/90">
                {l.id} · {l.location}
              </p>
              <p className="font-heading text-2xl text-foreground">{currency(l.price)}</p>
              <p className="text-xs text-muted-foreground">
                {l.tag} · {l.note}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
