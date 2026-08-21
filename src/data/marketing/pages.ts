import type { MarketingPageKey } from './site';

interface MarketingSeo {
  title: string;
  description: string;
}

interface MarketingHeroContent {
  eyebrow: string;
  title: string;
  lead: string;
}

interface MarketingPage {
  seo: MarketingSeo;
  hero: MarketingHeroContent;
  secondaryCta?: { label: string; href: string };
  sections?: string[];
}

export const marketingPages = {
  home: {
    seo: {
      title:
        "The Swift Project | Own your place in Ghana. Let it work while you're away.",
      description:
        "Fully finished modular residences inside professionally managed hospitality villages across Accra, Kumasi, Tamale, and Takoradi. Yours when you're home. Productive when you're not.",
    },
    hero: {
      eyebrow: 'THE SWIFT PROJECT · GHANA',
      title: "Own your place in Ghana. Let it work while you're away.",
      lead: "Fully finished modular residences inside professionally managed hospitality villages. Yours when you're home. Productive when you're not.",
    },
    secondaryCta: { label: 'See how ownership works', href: '/how-it-works' },
    sections: [
      "You wanted a place in Ghana. Not another construction project to manage from abroad. The land. The contractor. The materials. The delays. The revised material list that arrives after you've paid. The calls across time zones. The trip home just to check what is going on. For too many of us abroad, the dream became a remote job with no salary. We built The Swift Project around a different question: what if you could own the finished place — without personally managing everything it takes to build and run it?",
      "Yours when you're home. Productive when you're not. When you're in Ghana: come home to your own fully furnished residence. Reserve your dates — December, family weeks, remote-work months. Your clothes stay in the wardrobe. Your things stay where you left them. When you're away: your residence joins the village's managed hospitality operation. Guests, pricing, housekeeping, maintenance — handled by our on-ground team. You don't have to choose between a place for yourself and an asset that works. It does both.",
      'The P7 Capsule — thirty-eight square metres, considered down to the last one. Full-height glazing that opens the room to the trees. Warm timber inside. A private deck for morning coffee. Engineered as a complete product — structure, insulation, services, furniture — finished before it ever reaches your plot: nine-layer wall system, solar-ready roof, integrated services, turnkey furnishing.',
      'Your residence is private. The life around it is shared. A pool for slow afternoons. Fire-side evenings in December. Long tables under the pavilion. Children in the shallows while you finish your coffee. Places to be alone; places to host everyone you love. Not a row of prefabs. A village.',
      'Most of the building happens before the building arrives. Cost control: factory production removes the site surprises that inflate budgets. Parallel timelines: site preparation and home construction happen at once, not in sequence. Repeatable quality: every capsule built to the same standard, by the same team, with the same checks. Faster to first stay: months, not years, between decision and your first night home.',
      "You own the asset. We run the experience around it. While you're away, the village operates as a hospitality business — and your residence is part of it. Distribution and booking across the channels guests actually use. Dynamic pricing tuned to season and demand. Guest operations handled on the ground, not from abroad. Housekeeping, linen, and preventive maintenance. An owner portal with bookings, statements, and your own reservations — visible anytime. So ownership never becomes another full-time job.",
      "Don't take our word for it. Before you decide anything, you'll understand: exactly what you acquire — and the rights that come with it; what the operator manages, and what stays yours; how revenue and costs are treated, line by line; the assumptions behind every projection we show you; what happens if you want to exit. Clarity first. Decision second.",
      "We'd rather show you the assumptions than sell you the outcome. Ghana's short-let market runs at roughly 33–44% occupancy. Our model is built on documented assumptions — base case, stronger case, downside case — that you'll examine line by line in your briefing. No headline ROI theatre. No promises we can't defend.",
      'One standard. Four hubs. The Swift Project is a national network of hospitality villages, built to one standard. Four hubs anchor the map: Oyarifa · Accra — flagship village, where the network begins; Kumasi · Ashanti; Tamale · Northern; Takoradi · Western. 48, 24, 12, and 12 capsules respectively — 96 across the network. Same capsule. Same share. Same standard. Wherever you land.',
      "Maybe home doesn't have to mean choosing one country over another. A key that is yours. A room that remembers you. Your children growing up with somewhere in Ghana that is theirs — not a hotel, not a relative's spare room. December means something again. \"We're going home.\" And meaning it.",
      'Stay. Own. Partner. Book a visit and feel the village before you decide anything. Explore ownership — the residence, the operation, the numbers. Or bring land, capital, or operations and build a hub with us.',
    ],
  },
  village: {
    seo: {
      title: 'The Village | The Swift Project',
      description:
        'The village: P7 capsules 38m², shared land, nine-layer wall system, solar-ready, and the resort ecosystem across Ghana.',
    },
    hero: {
      eyebrow: 'The village',
      title: 'A village of capsules, held in common.',
      lead: 'Owner-investors hold the capsule; the village holds the land. Shared infrastructure, secure compounds, and a calmer rhythm than the city core. Each 38m² P7 Apple Capsule is precision-engineered in the factory and deployed in weeks, not years.',
    },
    secondaryCta: { label: 'See the locations', href: '/locations' },
    sections: [
      'P7 Apple Capsule 38m²: nine-layer wall system, galvanized steel frame, weather-sealed composite panels, acoustic & thermal insulation, solar-ready CIGS with inverter compatibility, LED throughout. Private composite deck, cocoon seating, perimeter privacy slats guarantee seclusion without blocking light or airflow. Built for the Ghanaian climate — tropical humidity, heavy rain, intense sun — with zero structural degradation and minimal upkeep.',
      'Resort ecosystem in every hub — not just units: central swimming pool as social centerpiece, hydrotherapy hot tub under the stars, communal fire pit lounge sunken seating, covered BBQ pavilion with adjustable louvered pergola for chef-led dining, and dedicated children’s play zones safely integrated. Master-planned for high retention, glowing reviews, and premium nightly rates from $100–$132.',
      'Capsule family across hubs: P7 hero plus Meridian 3-Bed (1,850 sqft, 3 bed/2 bath, $50k, Phase 1), Savannah 4-Bed (2,400 sqft, 4/3, $75k, Phase 2), Lagoon Studio Court (480 sqft ×24, $20k), Keta Waterfront (1,200 sqft, 2 bed, $60k). Same 70/30, same 5-year lock, same build standard — Illustrative reference imagery throughout, GATED factory certificates behind the briefing.',
    ],
  },
  howItWorks: {
    seo: {
      title: 'How It Works | The Swift Project',
      description:
        'From discovery briefing to revenue: the five-phase path to a P7 capsule and the five-year operating lock-in.',
    },
    hero: {
      eyebrow: 'The path',
      title: 'From first conversation to first revenue.',
      lead: 'Five phases, a five-year operating lock-in, and a 70 / 30 share settled monthly. The path is the same for every capsule across Greater Accra, Kumasi, Western and Northern.',
    },
    secondaryCta: { label: 'Check the numbers', href: '/ownership' },
    sections: [
      'Step 1 Private Executive Briefing — one-on-one with leadership to map your financial goals, segment (Local Ghanaian, Diaspora Partner, Institutional Fund), intent (stay/prefab/ecosystem) and bracket ($20k–$75k). Step 2 Prospectus & Dossier Review — verified forecasts, yield history, blueprints, municipal clearances. Every metric documented, 88% target vs 33–44% market, 300k Accra deficit, 6–10% growth.',
      'Step 3 Joint Venture Execution — 70/30 agreement under Ghanaian law, 70% investor equity backed by Swift 30% (land, IP, regulatory mastery), escrow before build. Step 4 Construction & Yield Generation — rapid modular deployment (70% faster), then professional short-let management across Airbnb/Booking.com/Vrbo with dynamic pricing (December peak vs standard), synchronized bookings, housekeeping, check-in, maintenance, monthly GHS settlement, USD held.',
      'Five sub-phases inside Step 4: Land & permits (title verified Ghanaian land law), Foundation (ground works), Delivery (P7 38m² arrives, nine-layer wall), Installation & finish (services, walkthrough), Revenue (70/30 starts). Lock 5 years, one operator, one ledger, one settlement — renewal or take full control after.',
    ],
  },
  ownership: {
    seo: {
      title: 'Ownership & Financials | The Swift Project',
      description:
        'A $50,000 entry, a 70 / 30 revenue share, and an operating model built on documented market data across Ghana.',
    },
    hero: {
      eyebrow: 'Ownership & financials',
      title: 'Know what you are choosing before you commit.',
      lead: 'One entry point, one share, one operator. The Swift Project keeps the owner path legible: $50,000, 70 / 30, and a monthly settlement. GATED full scenarios behind the briefing.',
    },
    secondaryCta: { label: 'See the protections', href: '/protections' },
    sections: [
      'The 70/30 split explained — investor 70% backed by Swift 30% non-cash (prime land in 4 hubs, proprietary P7 IP, regulatory mastery). Market intelligence: Accra short-let ADR $100–$132, market occ 33–44% scaling in December/summer, long-term prime vacancy ~20% bypassed via short-let, 300,000+ deficit Accra and 2M+ national, demand 6–10%. Gross GHS 51,400 at 88% × $132 × 30 nights → investor GHS 35,980 @ 70/30 — GATED full 5y 350% scenarios and hub-month matrices.',
      'Cash flow projections: 88% occupancy ($132 top of range) → $2,440 investor monthly at 30-day base ($3,485 gross) with 70/30; FX 14.7 → GHS 51,400/35,980. Diversified tenant base (business travelers, tourists, diaspora), dynamic weekly pricing, transparent dual-portal (payouts directly to investor, Swift handles upkeep). Cost certainty via factory fixed costs, no material inflation, 70% faster delivery.',
      'Why numbers hold — deficit documented (GSS, AirDNA, regional analysts), annual property value growth 6–10% vs custom-build liquidity lock, 9.4% annualised yield Q2 (GHS 2,998 paid 30 Jun) as proof. GATED documents: Partnership Summary 42p, Investor Models 38p, Whitepaper 24p — open after 5-step briefing and stay in portal vault.',
    ],
  },
  protections: {
    seo: {
      title: 'Protections | The Swift Project',
      description:
        'Escrow, Ghanaian land law, insurance, and the legal dossier behind every capsule.',
    },
    hero: {
      eyebrow: 'Protections',
      title: 'Clarity before confidence.',
      lead: 'Deposits into escrow, title under Ghanaian law, insured builds, and a legal dossier members can read in full. 5-year operational lock stabilizes brand equity before liquidity.',
    },
    secondaryCta: { label: 'Read the dossier', href: '/resources' },
    sections: [
      'De-risked frameworks: 5-year lock stabilizes brand equity, operational efficiency, foundational capital before external liquidity. No annual exit — renewal or take full control after 5 years. Title & land security: rigorous vetting across Greater Accra, Ashanti, Western, Northern — 100% litigation-free title verification, municipal compliance in every region, official stamp motif across Ghana map.',
      'Skin-in-the-game: Swift absorbs operational/zoning/municipal administrative burdens upfront — grids, water, connectivity, communal amenities (dining, wellness, pools via Ecosystem Fund). Capital insulated, focused on yield. Deposits escrow before build, nine-layer wall insured, CIGS solar-ready, one operator for 5 years, monthly settlement.',
      'Dossier: 3 long-form documents 42p/38p/24p — GATED behind briefing, delivered by invitation, remain in portal with session 7-day PBKDF2 hash. Encrypted, recorded, summarised briefings. Beyond gate: land title Plot 14 — 2.1MB PDF, statements, allocation — all litigation-free.',
    ],
  },
  locations: {
    seo: {
      title: 'Locations | The Swift Project',
      description:
        'Four hubs — Greater Accra 48, Ashanti 24, Western 12, Northern 12 — and the market case for each.',
    },
    hero: {
      eyebrow: 'Locations',
      title: 'Four hubs, one standard.',
      lead: 'The same capsule, the same 70 / 30, the same build standard — across the cities where Ghanaian demand is growing fastest. 48 Greater Accra (Oyarifa flagship), 24 Ashanti (Kumasi), 12 Western (Takoradi), 12 Northern (Tamale) = 96 capsules total.',
    },
    secondaryCta: { label: 'Start with the village', href: '/village' },
    sections: [
      'One standard, four cities — same 38m² P7 hero plus hub-tuned Meridian/Savannah/Lagoon/Keta variants, same 70/30, same 9-layer wall, same CIGS solar-ready, same 5y lock. Greater Accra 48 capsules flagship village Oyarifa — 18 funded already; Ashanti (Kumasi) 24 commercial heart of south — 4 funded; Northern (Tamale) 12 gateway to the north — 2 funded; Western (Takoradi) 12 oil and port city — 2 funded. 26/96 funded shows the ledger — GATED live availability per plot.',
      'Demand that outruns supply: Accra 300,000+ deficit, national 2M+, demand 6–10% per year, market 33–44% vs unit target 88% (SIM ledger public, sources in dossier). Oyarifa corridor strategic between Aburi and downtown Accra no longer single-lock — nationwide modular ecosystems cut timelines 70% while delivering rental yields. Rapid modular deployment weeks vs years.',
      'Map & master plan: central swimming pool flanked by P7 capsules, hydrotherapy spa, stone-paved fire pit lounge, louvered BBQ pavilion, kids zones — repeated per hub with local tropical landscaping. Technical cutaway: insulation layers, steel framing, solar integration panels. Every hub master-planned for premium nightly rates $100–$132 and dynamic pricing.',
    ],
  },
  partnership: {
    seo: {
      title: 'Partnership | The Swift Project',
      description:
        'Two pathways: become an owner-investor, or partner with the Ecosystem Fund for institutional deployment.',
    },
    hero: {
      eyebrow: 'Partnership',
      title: 'Two ways into the project.',
      lead: 'Owner-investors set up capsules on the 70 / 30. The Ecosystem Fund deploys institutional capital across hubs at scale — both via the same briefing gate.',
    },
    secondaryCta: { label: 'See the financials', href: '/ownership' },
    sections: [
      'Owner-Investor: $50,000 entry for P7 38m² (or $20k–$75k for family variants), 70/30, 5-year hosting, monthly GHS settled USD held, personal sanctuary when you visit (block dates in owner portal) + commercial income when away. Primary audience diaspora — USD-denominated numbers, English docs, escrow, GHS settlement at home.',
      'Ecosystem Fund: institutional capital deployed across 4 hubs at scale, diversified exposure to village backbone (grids, water, connectivity, dining/wellness/pools). Institutional minimums, institutional reporting, Partnership Pathway 2 — same 70/30 economics but diversified across 96 capsules. GATED institutional models 38p behind briefing.',
      'Why two pathways: individuals own capsules (tangible asset 100% in investor name, direct payout control, zero disintermediation, flexibility to adapt after 5y), Fund owns hubs (backbone). Both share one operator, one ledger, one settlement. Next step is always the private executive briefing — no public sales funnel, 5 guided steps branches by profile.',
    ],
  },
  about: {
    seo: {
      title: 'About | The Swift Project',
      description:
        'Why The Swift Project exists: certainty, craft, and a better model for modular hospitality in Ghana.',
    },
    hero: {
      eyebrow: 'About',
      title: 'Built with certainty, not promises.',
      lead: 'The Swift Project designs, builds, and operates hospitality villages for the diaspora returning home — and for Ghanaians building at home. 20 Edmonton St, Madina, Accra.',
    },
    secondaryCta: { label: 'Request a briefing', href: '/briefing' },
    sections: [
      'Pioneering West African real estate: The Swift Project integrates cutting-edge modular with premium hospitality to bridge local Ghanaian opportunity and sophisticated global wealth. Vision — modular innovation efficiency meets elegance: architects of speed and quality, advanced modular delivers high-end durable solutions in record time, reduced disruption, superior consistency, new benchmark for residential/commercial.',
      'Luxury hospitality operations: experiential stays blending local culture with luxury amenities, sustainable long-term yield. Ghana & global wealth bridge: rigorous operational standards, absolute transparency, secure productive culturally resonant home for international capital across 4 hubs. By the numbers: 38m² nine-layer CIGS, $50k entry, 70/30, 5y lock, 4 hubs Oyarifa·Kumasi·Tamale·Takoradi.',
      'Speak with the operator, not a booth: calls/briefings handled by project team directly — Ghana +233 544 101016, North America +1 437 421 0963, info@swiftholdings.org, partnerships@swiftholdings-ghana.com.',
    ],
  },
  resources: {
    seo: {
      title: 'Resources | The Swift Project',
      description:
        'The partnership summary, investor summary, and institutional whitepaper — behind the discovery briefing.',
    },
    hero: {
      eyebrow: 'Resources',
      title: 'The detail, held for members.',
      lead: 'Three long-form documents carry the real substance. They open after a discovery briefing, and stay with members in the portal. GATED vault — 42p Partnership Summary, 38p Investor Models, 24p Whitepaper.',
    },
    secondaryCta: { label: 'Join through a briefing', href: '/briefing' },
    sections: [
      'Library: Partnership Summary 42 pages 45min — bound summary; Investor Summary & Partnership Models 38 pages 1.5h — financial edition; Institutional Modular Hospitality in Ghana 24 pages 2h — whitepaper. All 3 behind briefing, delivered by invitation, remain in portal with 7-day PBKDF2 session. GATED teaser shows cover, page count, duration, and “Opens after discovery briefing”.',
      'Proof & methodology: AirDNA/GSS short-let metrics, 300k/2M deficits, 6–10% growth, 33–44% vs 88%, $100–$132 ADR, 70% reduction delivery, protected revenue 70% retained — aggregated public ledger SIM, full tables/methodology GATED. Image truthfulness: all current marketing imagery Illustrative reference, not completed Swift project photography, visible label + alt.',
      'Performance & access: Mobile-first, CDN WebP, 16:10 hero etc; SSL encryption, strict data privacy, password-protected vault; CRM lead routing briefing → executive schedule. Portal preview on resources: GHS 127,400 chart, statements, 5-doc vault blurred rows — click to /briefing to unlock.',
    ],
  },
  briefing: {
    seo: {
      title: 'Briefing | The Swift Project',
      description:
        'Request a private discovery briefing on owning a P7 capsule in Ghana.',
    },
    hero: {
      eyebrow: 'Private briefing',
      title: 'Tell us what you are planning.',
      lead: 'Share the essentials, and we reply with a more relevant next conversation. Briefings are encrypted, recorded, and summarised. Five guided steps branching by profile, gate opens the moment you submit, long-form documents appear GATED on the other side.',
    },
    sections: [
      'Five guided steps: 1 Who are you? (Local Ghanaian / Diaspora Partner / Institutional Fund), 2 Why are you here? (stay/prefab/ecosystem), 3 Capital plans ($50k P7 or ecosystem), 4 Contact details (name/email/phone/password PBKDF2), 5 Briefing schedule (timezone GMT±, 5 business days, 6 slot times 09:00–17:30, 45-min encrypted calendar). Back/Continue logic handles stay skip, bracket None yet, validation inline with focus first error.',
      'Secure intake architecture: full name & contact verified, investor profile classification, tiered capital brackets across 4 hubs, interactive calendar executive availability. Secure calendar integration Calendly Enterprise/custom API — automated encrypted invite with virtual room/boardroom coordinates, global timezone sync, shield motif. Submissions POST /api/discovery → Drizzle member + SESSION KV.',
      'After submit: “You are in” — 20% progress bar → 100%, gate open, member ID SW-0024 etc, download Partnership Summary 42p, Go to your documents → /members/documents/partnership-summary. Values preserved on failure, retry + mailto fallback if PUBLIC_FORMSPREE_BRIEFING_ENDPOINT blank, no client-side logging, honeypot, rate-limit, same-origin check.',
    ],
  },
} as const satisfies Record<MarketingPageKey, MarketingPage>;
