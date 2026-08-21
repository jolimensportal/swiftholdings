"use client";

import { useState } from "react";

const SEGMENTS = ["Ghanaian", "Diaspora", "Institutional"] as const;

export function SegmentedControl() {
  const [active, setActive] = useState<(typeof SEGMENTS)[number]>("Diaspora");
  return (
    <div className="flex overflow-hidden rounded-md border border-primary/25 text-[10px] tracking-wide">
      {SEGMENTS.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => setActive(s)}
          className={
            "flex-1 px-2 py-1.5 text-center transition-colors " +
            (active === s ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground")
          }
        >
          {s}
        </button>
      ))}
    </div>
  );
}
