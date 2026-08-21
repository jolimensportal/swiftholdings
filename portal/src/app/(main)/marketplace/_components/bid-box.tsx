"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

export function BidBox({ defaultBid, minIncrement }: { defaultBid: number; minIncrement: number }) {
  const [bid, setBid] = useState(defaultBid);
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <input
          type="number"
          value={bid}
          min={defaultBid}
          step={minIncrement}
          onChange={(e) => setBid(Number(e.target.value))}
          className="flex-1 rounded border border-primary/40 bg-background px-3 py-3 text-lg tabular-nums text-foreground"
        />
        <span className="max-w-[90px] text-[10px] leading-tight text-muted-foreground">
          min increment ${minIncrement} · escrow-verified
        </span>
      </div>
      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
        Confirm bid — escrow-secured
      </Button>
    </div>
  );
}
