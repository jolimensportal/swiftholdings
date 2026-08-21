import { Card, CardContent } from "@/components/ui/card";
import { marketplaceFeatured, marketplaceListings } from "@/data/member-portal";
import { BidBox } from "./bid-box";

const currency = (n: number) => `$${n.toLocaleString("en-US")}`;

export function MarketplaceView() {
  const f = marketplaceFeatured;
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.24em] text-primary/80">
          Prefab Market &amp; Auctions — {f.location}
        </p>
        <span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs text-primary">
          02 / 06 listings open
        </span>
      </div>

      <Card className="overflow-hidden border-primary/20 p-0">
        <div className="grid lg:grid-cols-[1.55fr_1fr]">
          <div className="relative min-h-[420px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={f.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/55 to-background/5" />
            <div className="absolute bottom-0 left-0 max-w-md p-7">
              <p className="text-xs uppercase tracking-[0.22em] text-primary/90">Unit {f.id}</p>
              <p className="mt-1 font-heading text-5xl text-foreground">{f.title}</p>
              <p className="mt-3 text-sm text-muted-foreground/85">{f.blurb}</p>
            </div>
            <div className="absolute right-6 top-5 rounded-xl border border-primary/25 bg-primary/10 px-4 py-2 text-right backdrop-blur">
              <p className="font-heading text-2xl text-primary tabular-nums">{f.countdown}</p>
              <p className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
                until close
              </p>
            </div>
          </div>
          <CardContent className="flex flex-col gap-5 border-l border-primary/15 py-7">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-primary/75">Current bid</p>
                <p className="font-heading text-5xl text-primary">{currency(f.currentBid)}</p>
              </div>
              <span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs text-primary">
                reserve {currency(f.reserve)} · met
              </span>
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

      <div className="grid gap-4 sm:grid-cols-2">
        {marketplaceListings.map((l) => (
          <Card key={l.id} className="flex items-center gap-4 border-primary/20 p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={l.image} alt="" className="h-24 w-36 rounded-lg object-cover" />
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-primary/90">
                {l.id} · {l.location}
              </p>
              <p className="font-heading text-3xl text-foreground">{currency(l.price)}</p>
              <p className="mt-1 text-xs text-muted-foreground">{l.tag} · {l.note}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
