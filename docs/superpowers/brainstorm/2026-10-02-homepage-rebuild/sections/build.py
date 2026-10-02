#!/usr/bin/env python3
"""Generate the 14 section-preview pages for the Swift Horizon homepage rebuild.

Each section gets three treatments (A from The Ledger, B from The Long Room,
C from Four Rooms), stacked at full width with pick controls.
Copy is verbatim from the copy constitution — only craft differs.
"""
import os

OUT = os.path.dirname(os.path.abspath(__file__))

# ── shared copy fragments ───────────────────────────────────────────────
HERO_H1 = "Own your place in Ghana. Let it work while you&rsquo;re away."
HERO_SUB = ("Fully finished modular residences inside professionally managed hospitality "
            "villages. Yours when you&rsquo;re home. Productive when you&rsquo;re not.")

RAIL_IMGS = [
    ("a2-dry.jpg", "01", "Dry grass"),
    ("a3-frame.jpg", "02", "Gravel court"),
    ("a4-oaks.jpg", "03", "Under the oaks"),
    ("a5-pavilion.jpg", "04", "Glazing"),
    ("a6-pool.jpg", "05", "Shared pool"),
    ("a7-grass.jpg", "06", "Open grassland"),
    ("a8-palms.jpg", "07", "Tropical"),
    ("a9-minimal.jpg", "08", "Minimal"),
    ("a10-trees.jpg", "09", "Mature trees"),
    ("a11-corten.jpg", "10", "Weathered"),
    ("dusk-cta-desktop.webp", "11", "Dusk"),
]

DISCLOSURE = ("Every photograph is illustrative reference material, not a completed "
              "Swift Horizon capsule.")

OPS = [
    ("01", "Distribution &amp; booking", "Your residence listed across the channels guests actually use."),
    ("02", "Dynamic pricing", "Rates tuned to season and demand, so the calendar earns its keep."),
    ("03", "Guest operations", "Check-in, support, standards &mdash; handled on the ground, not from abroad."),
    ("04", "Housekeeping &amp; maintenance", "Turnovers, linen, preventive care. The unglamorous work, done."),
    ("05", "Owner portal", "Bookings, statements, and your own reservations &mdash; visible anytime."),
]

ACQUIRE = [
    ("01", "Exactly what you acquire", "And the rights that come with it."),
    ("02", "What the operator manages", "And what stays yours."),
    ("03", "How revenue and costs are treated", "Line by line."),
    ("04", "The assumptions behind every projection", "We show you."),
    ("05", "What happens if you want to exit", "Stated up front."),
]

MODULAR = [
    ("01", "Cost control", "Factory production removes the site surprises that inflate budgets."),
    ("02", "Parallel timelines", "Site preparation and home construction happen at once, not in sequence."),
    ("03", "Repeatable quality", "Every capsule built to the same standard, by the same team, with the same checks."),
    ("04", "Faster to first stay", "Months, not years, between decision and your first night home."),
]

HUBS = [
    ("Oyarifa", "Accra", "Flagship village &mdash; where the network begins", "48"),
    ("Kumasi", "Ashanti", "Commercial heart of the south", "24"),
    ("Tamale", "Northern", "Gateway to the north", "12"),
    ("Takoradi", "Western", "Oil and port city", "12"),
]

SPECS = ["Full-height glazing", "Private composite deck", "Nine-layer wall system",
         "Solar-ready roof", "Integrated services", "Turnkey furnishing"]

RAIL_FIGS = "\n".join(
    f'<figure><img src="../assets/{src}" alt="Illustrative reference"><figcaption>'
    f'<span class="tick"></span><span class="idx num">{idx}</span> {cap}</figcaption></figure>'
    for src, idx, cap in RAIL_IMGS)

def ledger(rows, cls="ledger"):
    out = []
    for n, h4, p in rows:
        out.append(f'<article><span class="n num">{n}</span><div><h4>{h4}</h4><p>{p}</p></div></article>')
    return f'<div class="{cls}">' + "".join(out) + '</div>'


# ── sections ────────────────────────────────────────────────────────────
S = {}

S['h'] = dict(
    title='Hero', mv='&mdash;',
    note='The one screen that has to carry the brand. All three keep the headline verbatim.',
    A=('From The Ledger',
       f'''<div class="hero-a g-dark"><img class="bg" src="../assets/a1-hero.jpg" alt="Illustrative reference of a low-profile timber residence in savanna grassland at dusk"><div class="veil"></div><div class="in">
<p class="kicker">Swift Horizon &middot; Ghana</p>
<h1>{HERO_H1}</h1>
<p class="sub">{HERO_SUB}</p>
<div class="cta-row"><a class="btn btn-gold" href="#">Request a private briefing</a><a class="btn btn-ghost" href="#">See how ownership works</a></div>
<p class="hero-note">A guided conversation, not a public sales funnel.</p>
</div></div>'''),
    B=('From The Long Room',
       f'''<div class="hero-b g-cream"><div>
<p class="kicker">Swift Horizon &middot; Ghana</p>
<h1>{HERO_H1}</h1>
</div><div>
<p class="sub">{HERO_SUB}</p>
<div class="cta-row"><a class="btn btn-gold" href="#">Request a private briefing</a><a class="btn btn-ghost" href="#">How it works</a></div>
<p class="hero-note">A guided conversation, not a public sales funnel.</p>
</div></div>
<div class="plate-band" style="margin-top:2.5rem"><img src="../assets/a1-hero.jpg" alt="Illustrative reference of a low-profile timber residence in savanna grassland at dusk"><p class="band">Oyarifa village &middot; Illustrative reference</p></div>'''),
    C=('From Four Rooms',
       f'''<div class="hero-c g-dark"><img class="bg" src="../assets/a1-hero.jpg" alt="Illustrative reference of a low-profile timber residence in savanna grassland at dusk"><div class="veil"></div>
<div class="in"><p class="vtag">I &middot; The ground</p>
<p class="kicker">Swift Horizon &middot; Ghana</p>
<h1>{HERO_H1}</h1>
<p class="sub">{HERO_SUB}</p>
<div class="cta-row"><a class="btn btn-gold" href="#">Request a private briefing</a><a class="btn btn-ghost" href="#">See how ownership works</a></div>
<p class="hero-note">A guided conversation, not a public sales funnel.</p>
</div></div>'''),
)

S['r'] = dict(
    title='The image rail', mv='&mdash;',
    note='The open question: twelve photographs, none of them a real Swift Horizon home. '
         'Three ways to carry that disclosure without saying it twelve times.',
    A=('From The Ledger &mdash; caption per frame',
       '''<div class="disc-per"><span class="txt">All imagery illustrative reference</span></div>
<div class="split split-l">
<figure class="plate"><img src="../assets/a2-dry.jpg" alt="Illustrative reference"><figcaption class="plate-cap">Illustrative reference &middot; Dry grass</figcaption></figure>
<figure class="plate"><img src="../assets/a3-frame.jpg" alt="Illustrative reference"><figcaption class="plate-cap">Illustrative reference &middot; Gravel court</figcaption></figure>
</div>'''),
    B=('From The Long Room &mdash; declared once per movement',
       '''<div class="disc-per"><span class="txt">All imagery illustrative reference</span><em class="imgs">applies to every photograph below</em></div>
<div class="plate-band"><img src="../assets/a2-dry.jpg" alt="Illustrative reference"><p class="band">Village approach &middot; Illustrative reference</p></div>'''),
    C=('From Four Rooms &mdash; one rail, one tick each',
       f'''<div class="g-dark" style="padding:2rem 1.5rem;border-radius:2px">
<div class="rail-head"><p class="t">The capsule, and the village around it.</p><p class="d">11 images &middot; all illustrative reference</p></div>
<div class="rail">{RAIL_FIGS}</div>
</div>
<p class="credits-line" style="color:oklch(.93 .014 85 / .38)">Every photograph above is illustrative reference material, not a completed Swift Horizon capsule.</p>'''),
)

S['s01'] = dict(
    title='The problem', mv='I',
    note='The emotional entry point. Same words, three spatial treatments.',
    A=('From The Ledger &mdash; dark asymmetric split',
       '''<div class="g-dark" style="padding:2.5rem">
<p class="mv-num">I</p>
<div class="split split-tall-l">
<div>
<h2 class="t-stmt">You wanted a place in Ghana. Not another construction project to manage from abroad.</h2>
<p class="body">The land. The contractor. The materials. The delays. The revised material list that arrives after you&rsquo;ve paid. The calls across time zones. The trip home just to check what is going on.</p>
<p class="body">For too many of us abroad, the dream became a remote job with no salary.</p>
<p class="body">We built Swift Horizon around a different question: what if you could own the finished place &mdash; without personally managing everything it takes to build and run it?</p>
<p class="moment sans">The dream stopped being a job. It started being an asset.</p>
</div>
<figure class="plate plate-tall"><img src="../assets/a2-dry.jpg" alt="Illustrative reference of a timber and steel residence in dry ornamental grass"><figcaption class="plate-cap">Illustrative reference &middot; Dry grass</figcaption></figure>
</div></div>'''),
    B=('From The Long Room &mdash; cream, serif display',
       '''<div class="g-cream" style="padding:2.5rem">
<p class="mv-num">I</p>
<div class="split split-r">
<div>
<h2 class="t-display">You wanted a place in Ghana. Not <span class="em">another construction project</span> to manage from abroad.</h2>
<p class="body">The land. The contractor. The materials. The delays. The revised material list that arrives after you&rsquo;ve paid. The calls across time zones. The trip home just to check what is going on.</p>
<p class="body">For too many of us abroad, the dream became a remote job with no salary.</p>
<p class="body">We built Swift Horizon around a different question: what if you could own the finished place &mdash; without personally managing everything it takes to build and run it?</p>
<p class="moment">The dream stopped being a job. It started being an asset.</p>
</div>
<figure class="plate plate-tall"><img src="../assets/a2-dry.jpg" alt="Illustrative reference of a timber and steel residence in dry ornamental grass"></figure>
</div></div>'''),
    C=('From Four Rooms &mdash; sticky two-column room',
       '''<div class="g-dark" style="padding:2.5rem">
<p class="mv-num">I &middot; The ground</p>
<div class="split split-l">
<div class="sticky">
<p class="kicker">Owning back home shouldn&rsquo;t become a second job</p>
<h2 class="t-stmt">You wanted a place in Ghana. Not <span class="em">another construction project</span> to manage from abroad.</h2>
<p class="body">The land. The contractor. The materials. The delays. The revised material list that arrives after you&rsquo;ve paid. The calls across time zones. The trip home just to check what is going on.</p>
<p class="body">For too many of us abroad, the dream became a remote job with no salary.</p>
<p class="moment">The dream stopped being a job. It started being an asset.</p>
</div>
<div>
<p class="body">We built Swift Horizon around a different question: what if you could own the finished place &mdash; without personally managing everything it takes to build and run it?</p>
<figure class="plate plate-tall" style="margin-top:1.5rem"><img src="../assets/a2-dry.jpg" alt="Illustrative reference of a timber and steel residence in dry ornamental grass"><span class="plate-corner"><span class="tk"></span></span></figure>
<p class="credits-line">Illustrative reference</p>
</div>
</div></div>'''),
)

S['s02'] = dict(
    title='The mechanism', mv='II',
    note='The core promise: yours when home, productive when away.',
    A=('From The Ledger &mdash; numbered ledger',
       '''<div class="g-dark" style="padding:2.5rem">
<p class="mv-num">II</p>
<h2 class="t-stmt">Yours when you&rsquo;re home.<br>Productive when you&rsquo;re not.</h2>
<div class="ledger">
<article><span class="n num">01</span><div><h4>When you&rsquo;re in Ghana</h4><p>Come home to your own fully furnished residence. Reserve your dates &mdash; December, family weeks, remote-work months. Your clothes stay in the wardrobe. Your things stay where you left them.</p></div></article>
<article><span class="n num">02</span><div><h4>When you&rsquo;re away</h4><p>Your residence joins the village&rsquo;s managed hospitality operation. Guests, pricing, housekeeping, maintenance &mdash; handled by our on-ground team.</p></div></article>
</div>
<p class="moment sans">You don&rsquo;t have to choose between a place for yourself and an asset that works. It does both.</p>
</div>'''),
    B=('From The Long Room &mdash; paired states on cream',
       '''<div class="g-cream" style="padding:2.5rem">
<p class="mv-num">II</p>
<h2 class="t-display">Yours when you&rsquo;re home.<br>Productive when you&rsquo;re not.</h2>
<div class="pair">
<article><div class="st"><span class="n num">01</span><h3>When you&rsquo;re in Ghana</h3></div><p>Come home to your own fully furnished residence. Reserve your dates &mdash; December, family weeks, remote-work months. Your clothes stay in the wardrobe. Your things stay where you left them.</p></article>
<article><div class="st"><span class="n num">02</span><h3>When you&rsquo;re away</h3></div><p>Your residence joins the village&rsquo;s managed hospitality operation. Guests, pricing, housekeeping, maintenance &mdash; handled by our on-ground team.</p></article>
</div>
<p class="moment">You don&rsquo;t have to choose between a place for yourself and an asset that works. It does both.</p>
</div>'''),
    C=('From Four Rooms &mdash; statement left, states right',
       '''<div class="g-dark" style="padding:2.5rem">
<p class="mv-num">II &middot; The mechanism</p>
<div class="split split-l">
<div class="sticky">
<h2 class="t-stmt">Yours when you&rsquo;re home. <span class="em">Productive</span> when you&rsquo;re not.</h2>
<p class="body">You don&rsquo;t have to choose between a place for yourself and an asset that works. It does both.</p>
</div>
<div class="pair">
<article><div class="st"><span class="n num">01</span><h3>When you&rsquo;re in Ghana</h3></div><p>Come home to your own fully furnished residence. Reserve your dates &mdash; December, family weeks, remote-work months. Your clothes stay in the wardrobe. Your things stay where you left them.</p></article>
<article><div class="st"><span class="n num">02</span><h3>When you&rsquo;re away</h3></div><p>Your residence joins the village&rsquo;s managed hospitality operation. Guests, pricing, housekeeping, maintenance &mdash; handled by our on-ground team.</p></article>
</div>
</div></div>'''),
)

S['s06'] = dict(
    title='Village operations', mv='II',
    note='Five managed services. The driest content on the page &mdash; watch which treatment holds it.',
    A=('From The Ledger &mdash; statement left, ledger right',
       f'''<div class="g-dark" style="padding:2.5rem">
<p class="mv-num">II</p>
<div class="split split-r">
<figure class="plate"><img src="../assets/a4-oaks.jpg" alt="Illustrative reference of a dark-clad residence beneath mature trees"><figcaption class="plate-cap">Illustrative reference &middot; Under the oaks</figcaption></figure>
<div>
<h2 class="t-stmt">You own the asset. We run the experience around it.</h2>
<p class="body">While you&rsquo;re away, the village operates as a hospitality business &mdash; and your residence is part of it.</p>
{ledger(OPS)}
<p class="moment sans">So ownership never becomes another full-time job.</p>
</div>
</div></div>'''),
    B=('From The Long Room &mdash; cream ledger, full-bleed plate',
       f'''<div class="plate-band"><img src="../assets/a4-oaks.jpg" alt="Illustrative reference of a dark-clad residence beneath mature trees"><p class="band">Village operations &middot; Illustrative reference</p></div>
<div class="g-cream" style="padding:2.5rem">
<p class="mv-num">II</p>
<div class="split split-l">
<div>
<h2 class="t-display">You own the asset. <span class="em">We run the experience</span> around it.</h2>
<p class="body">While you&rsquo;re away, the village operates as a hospitality business &mdash; and your residence is part of it.</p>
<p class="moment">So ownership never becomes another full-time job.</p>
</div>
<div>{ledger(OPS)}</div>
</div></div>'''),
    C=('From Four Rooms &mdash; sticky statement + ruled list',
       f'''<div class="g-dark" style="padding:2.5rem">
<p class="mv-num">II &middot; Operations</p>
<div class="split split-l">
<div class="sticky">
<h2 class="t-stmt">You own the asset. <span class="em">We run the experience</span> around it.</h2>
<p class="body">While you&rsquo;re away, the village operates as a hospitality business &mdash; and your residence is part of it.</p>
<p class="moment">So ownership never becomes another full-time job.</p>
</div>
<div>{ledger(OPS)}</div>
</div></div>'''),
)

S['s03'] = dict(
    title='The P7 capsule', mv='III',
    note='38 m&sup2; is the single hardest number on the page. Three ways to give it weight.',
    A=('From The Ledger &mdash; giant numeral, pill specs',
       f'''<div class="g-cream" style="padding:2.5rem">
<p class="mv-num">III &middot; The product</p>
<div class="split split-l">
<div>
<p class="kicker">The P7 Capsule</p>
<p class="cap-num"><span class="big">38</span><span class="unit">Square metres</span></p>
<h3 class="t-h3">Considered down to the last one.</h3>
<p class="body">Full-height glazing that opens the room to the trees. Warm timber inside. A private deck for morning coffee. Engineered as a complete product &mdash; structure, insulation, services, furniture &mdash; finished before it ever reaches your plot.</p>
<ul class="specs-pill">{"".join(f"<li>{s}</li>" for s in SPECS)}</ul>
</div>
<figure class="plate"><img src="../assets/a5-pavilion.jpg" alt="Illustrative reference of a timber pavilion residence with full-height glazing"><figcaption class="plate-cap">Illustrative reference &middot; Glazing</figcaption></figure>
</div></div>'''),
    B=('From The Long Room &mdash; numeral, image, spec table',
       f'''<div class="g-cream" style="padding:2.5rem">
<p class="mv-num">III &middot; The product</p>
<div class="split split-r">
<figure class="plate"><img src="../assets/a5-pavilion.jpg" alt="Illustrative reference of a timber pavilion residence with full-height glazing"></figure>
<div>
<p class="kicker">The P7 Capsule</p>
<p class="cap-num"><span class="big">38</span><span class="unit">Square metres</span></p>
<h3 class="t-h3">Considered down to the last one.</h3>
<p class="body">Full-height glazing that opens the room to the trees. Warm timber inside. A private deck for morning coffee. Engineered as a complete product &mdash; structure, insulation, services, furniture &mdash; finished before it ever reaches your plot.</p>
<table class="spec-table"><tbody>{"".join(f'<tr><td>{i+1:02d}</td><td>{s}</td></tr>' for i,s in enumerate(SPECS))}</tbody></table>
</div>
</div></div>'''),
    C=('From Four Rooms &mdash; numeral set beside an inset column',
       f'''<div class="g-cream" style="padding:2.5rem">
<p class="mv-num">III &middot; The product</p>
<p class="kicker">The P7 Capsule</p>
<div class="cap-grid">
<p class="cap-num" style="margin:0"><span class="big">38</span></p>
<div class="cap-num-inset">
<p class="unit" style="font-size:.6875rem;letter-spacing:.16em;text-transform:uppercase;color:var(--gold-400);margin:0 0 .5rem">Square metres</p>
<h3 class="t-h3">Considered down to the last one.</h3>
<p class="body">Full-height glazing that opens the room to the trees. Warm timber inside. A private deck for morning coffee. Engineered as a complete product &mdash; structure, insulation, services, furniture &mdash; finished before it ever reaches your plot.</p>
</div>
</div>
<div class="specs-grid">{"".join(f'<div><span class="n num">{i+1:02d}</span><span class="t">{s}</span></div>' for i,s in enumerate(SPECS))}</div>
</div>'''),
)

S['s04'] = dict(
    title='The village', mv='III',
    note='The emotional centre. No numbers here at all.',
    A=('From The Ledger &mdash; image left, words right',
       '''<div class="g-cream" style="padding:2.5rem">
<p class="mv-num">III</p>
<div class="split split-r">
<div>
<h2 class="t-stmt">Your residence is private. The life around it is shared.</h2>
<p class="body">A pool for slow afternoons. Fire-side evenings in December. Long tables under the pavilion. Children in the shallows while you finish your coffee. Places to be alone; places to host everyone you love.</p>
<p class="moment sans">Not a row of prefabs. A village.</p>
</div>
<figure class="plate"><img src="../assets/a6-pool.jpg" alt="Illustrative reference of a residence opening onto a shared pool deck"><figcaption class="plate-cap">Illustrative reference &middot; Shared pool</figcaption></figure>
</div></div>'''),
    B=('From The Long Room &mdash; tall plate, wide split',
       '''<div class="g-cream" style="padding:2.5rem">
<p class="mv-num">III &middot; The village</p>
<div class="split split-l">
<div>
<h2 class="t-display">Your residence is private. <span class="em">The life around it is shared.</span></h2>
<p class="body">A pool for slow afternoons. Fire-side evenings in December. Long tables under the pavilion. Children in the shallows while you finish your coffee. Places to be alone; places to host everyone you love.</p>
<p class="moment">Not a row of prefabs. A village.</p>
</div>
<figure class="plate plate-tall"><img src="../assets/a6-pool.jpg" alt="Illustrative reference of a residence opening onto a shared pool deck"></figure>
</div></div>'''),
    C=('From Four Rooms &mdash; type only, two staggered columns',
       '''<div class="g-cream" style="padding:2.5rem">
<p class="mv-num">III &middot; The village</p>
<div class="duo">
<h2 class="t-stmt">Your residence is private. <span class="em">The life around it is shared.</span></h2>
<div class="col-stagger">
<p class="body">A pool for slow afternoons. Fire-side evenings in December. Long tables under the pavilion. Children in the shallows while you finish your coffee. Places to be alone; places to host everyone you love.</p>
<p class="moment">Not a row of prefabs. A village.</p>
</div>
</div></div>'''),
)

S['s05'] = dict(
    title='Why modular', mv='III',
    note='Four reasons. The live page handles these well enough, but the ordering and the pairing can change.',
    A=('From The Ledger &mdash; image left, ledger right',
       f'''<div class="g-cream" style="padding:2.5rem">
<p class="mv-num">III</p>
<p class="kicker">Why modular</p>
<h2 class="t-stmt">Most of the building happens before the building arrives.</h2>
<div class="split split-l">
<figure class="plate"><img src="../assets/a7-grass.jpg" alt="Illustrative reference of a low residence set in open grassland"><figcaption class="plate-cap">Illustrative reference &middot; Open grassland</figcaption></figure>
<div>{ledger(MODULAR)}</div>
</div></div>'''),
    B=('From The Long Room &mdash; full-bleed ledger, no image in section',
       f'''<div class="g-cream" style="padding:2.5rem">
<p class="mv-num">III &middot; Why modular</p>
<h2 class="t-display">Most of the building happens before the building arrives.</h2>
<div class="split split-l">
<div>
<p class="kicker">Why modular</p>
<p class="body">Most of the building happens before the building arrives.</p>
</div>
<div>{ledger(MODULAR)}</div>
</div></div>'''),
    C=('From Four Rooms &mdash; statement left, ruled reasons right',
       f'''<div class="g-cream" style="padding:2.5rem">
<p class="mv-num">III &middot; Why modular</p>
<div class="split split-l">
<div class="sticky">
<p class="kicker">Why modular</p>
<h2 class="t-display">Most of the building happens before the building arrives.</h2>
</div>
<div>{ledger(MODULAR)}</div>
</div></div>'''),
)

S['s07'] = dict(
    title='What you acquire', mv='IV',
    note='Five disclosures. This is the trust section &mdash; it should feel like a document, not a pitch.',
    A=('From The Ledger &mdash; dark ledger with captions',
       f'''<div class="g-dark" style="padding:2.5rem">
<p class="mv-num">IV &middot; Proof</p>
<div class="split split-l">
<div>
<h2 class="t-stmt">Don&rsquo;t take our word for it.</h2>
<p class="body">Before you decide anything, you&rsquo;ll understand:</p>
{ledger(ACQUIRE)}
<p class="moment sans">Clarity first. Decision second.</p>
</div>
<figure class="plate"><img src="../assets/a8-palms.jpg" alt="Illustrative reference of a warm timber residence in tropical planting"><figcaption class="plate-cap">Illustrative reference &middot; Tropical</figcaption></figure>
</div></div>'''),
    B=('From The Long Room &mdash; cream, sticky statement',
       f'''<div class="g-dark" style="padding:2.5rem">
<p class="mv-num">IV &middot; Proof</p>
<div class="split split-l">
<div class="sticky">
<p class="kicker">Before you decide anything</p>
<h2 class="t-display">Don&rsquo;t take our word for it.</h2>
<p class="body">You&rsquo;ll understand exactly this, before anything is signed.</p>
<p class="moment">Clarity first. Decision second.</p>
</div>
<div>{ledger(ACQUIRE)}</div>
</div></div>'''),
    C=('From Four Rooms &mdash; document rows, statement locked left',
       f'''<div class="g-dark" style="padding:2.5rem">
<p class="mv-num">IV &middot; Proof</p>
<div class="split split-r">
<div>{ledger(ACQUIRE)}</div>
<div class="sticky">
<p class="kicker">Before you decide anything</p>
<h2 class="t-stmt">Don&rsquo;t take our word for it.</h2>
<p class="body">You&rsquo;ll understand exactly this, before anything is signed.</p>
<p class="moment">Clarity first. Decision second.</p>
</div>
</div></div>'''),
)

S['s08'] = dict(
    title='The assumptions', mv='IV',
    note='Three scenarios. The live page puts these in a 3-equal-card grid that renders as three empty cream boxes. '
         'All three of these avoid that, differently.',
    A=("From The Ledger &mdash;s staggered panel stack",
       '''<div class="g-dark" style="padding:2.5rem">
<p class="mv-num">IV &middot; The numbers</p>
<h2 class="t-stmt">We&rsquo;d rather show you the assumptions than sell you the outcome.</h2>
<p class="body">Ghana&rsquo;s short-let market runs at roughly 33&ndash;44% occupancy. Our model is built on documented assumptions &mdash; base case, stronger case, downside case &mdash; that you&rsquo;ll examine line by line in your briefing.</p>
<div class="scn-stack">
<article><p class="scn-tag">Case 01</p><h4>Base case</h4><p>The expectation we can defend today.</p></article>
<article><p class="scn-tag">Case 02</p><h4>Stronger case</h4><p>The upside if demand runs stronger.</p></article>
<article><p class="scn-tag">Case 03</p><h4>Downside case</h4><p>The floor we plan around.</p></article>
</div>
<p class="moment sans">No headline ROI theatre. No promises we can&rsquo;t defend.</p>
</div>'''),
    B=("From The Long Room &mdash;s staggered rules",
       '''<div class="g-dark" style="padding:2.5rem">
<p class="mv-num">IV &middot; The numbers</p>
<div class="split split-l">
<div>
<h2 class="t-display">We&rsquo;d rather show you the assumptions than sell you the outcome.</h2>
<p class="body">Ghana&rsquo;s short-let market runs at roughly 33&ndash;44% occupancy. Our model is built on documented assumptions &mdash; base case, stronger case, downside case &mdash; that you&rsquo;ll examine line by line in your briefing.</p>
<p class="moment">No headline ROI theatre. No promises we can&rsquo;t defend.</p>
</div>
<div class="scn-stagger">
<article><p class="scn-tag">Case 01</p><h4>Base case</h4><p>The expectation we can defend today.</p></article>
<article><p class="scn-tag">Case 02</p><h4>Stronger case</h4><p>The upside if demand runs stronger.</p></article>
<article><p class="scn-tag">Case 03</p><h4>Downside case</h4><p>The floor we plan around.</p></article>
</div>
</div></div>'''),
    C=("From Four Rooms &mdash;s descending diagonal",
       '''<div class="g-dark" style="padding:2.5rem">
<p class="mv-num">IV &middot; The numbers</p>
<div class="split split-l">
<div>
<h2 class="t-stmt">We&rsquo;d rather show you the <span class="em">assumptions</span> than sell you the outcome.</h2>
<p class="body">Ghana&rsquo;s short-let market runs at roughly 33&ndash;44% occupancy. Our model is built on documented assumptions &mdash; base case, stronger case, downside case &mdash; that you&rsquo;ll examine line by line in your briefing.</p>
</div>
<div class="scn-diag">
<article><p class="scn-tag">Case 01</p><div><h4>Base case</h4><p>The expectation we can defend today.</p></div></article>
<article><p class="scn-tag">Case 02</p><div><h4>Stronger case</h4><p>The upside if demand runs stronger.</p></div></article>
<article><p class="scn-tag">Case 03</p><div><h4>Downside case</h4><p>The floor we plan around.</p></div></article>
</div>
</div>
<p class="moment">No headline ROI theatre. No promises we can&rsquo;t defend.</p>
</div>'''),
)

S['s09'] = dict(
    title='The network', mv='IV',
    note='Four hubs, 96 capsules. The live page shows these as cards; the counts read better as a ledger.',
    A=('From The Ledger &mdash; table',
       '''<div class="g-dark" style="padding:2.5rem">
<p class="mv-num">IV &middot; The network</p>
<h2 class="t-stmt">One standard. Four hubs.</h2>
<p class="body">Swift Horizon is a national network of hospitality villages, built to one standard. Four hubs anchor the map.</p>
<table class="hub-table">
<thead><tr><th>Hub</th><th>Position</th><th style="text-align:right">Capsules</th></tr></thead>
<tbody>
<tr><td>Oyarifa</td><td class="sub">Accra &middot; Flagship village &mdash; where the network begins</td><td class="ct">48</td></tr>
<tr><td>Kumasi</td><td class="sub">Ashanti &middot; Commercial heart of the south</td><td class="ct">24</td></tr>
<tr><td>Tamale</td><td class="sub">Northern &middot; Gateway to the north</td><td class="ct">12</td></tr>
<tr><td>Takoradi</td><td class="sub">Western &middot; Oil and port city</td><td class="ct">12</td></tr>
<tr class="total"><td colspan="2">Same capsule. Same share. Same standard. Wherever you land.</td><td class="ct">96</td></tr>
</tbody></table>
</div>'''),
    B=('From The Long Room &mdash; ruled hub rows on cream',
       f'''<div class="g-cream" style="padding:2.5rem">
<p class="mv-num">IV &middot; The network</p>
<h2 class="t-display">One standard. Four hubs.</h2>
<p class="body">Swift Horizon is a national network of hospitality villages, built to one standard. Four hubs anchor the map.</p>
<div class="hub-rows">{"".join(f'<article><span class="name">{n}</span><span class="sub"><em>{r}</em>{d}</span><span class="ct">{c}<span>capsules</span></span></article>' for n,r,d,c in HUBS)}</div>
<p class="hub-total"><span>Same capsule. Same share. Same standard. Wherever you land.</span><span class="num">96 capsules</span></p>
</div>'''),
    C=('From Four Rooms &mdash; sticky statement, ruled rows right',
       f'''<div class="g-dark" style="padding:2.5rem">
<p class="mv-num">IV &middot; The network</p>
<div class="split split-l">
<div class="sticky">
<h2 class="t-stmt">One standard. <span class="em">Four hubs.</span></h2>
<p class="body">Swift Horizon is a national network of hospitality villages, built to one standard. Four hubs anchor the map.</p>
<p class="moment">Same capsule. Same share. Same standard. Wherever you land.</p>
</div>
<div class="hub-rows">{"".join(f'<article><span class="name">{n}</span><span class="sub"><em>{r}</em>{d}</span><span class="ct">{c}<span>capsules</span></span></article>' for n,r,d,c in HUBS)}</div>
</div></div>'''),
)

S['s10'] = dict(
    title='Between two places', mv='IV',
    note='The diaspora passage. Purely emotional &mdash; no numbers, no ledger.',
    A=('From The Ledger &mdash; statement left, prose right',
       '''<div class="g-dark" style="padding:2.5rem">
<p class="mv-num">IV</p>
<p class="kicker">For those who live between two places</p>
<div class="split split-l">
<h2 class="t-stmt">Maybe home doesn&rsquo;t have to mean choosing one country over another.</h2>
<div>
<p class="body">A key that is yours. A room that remembers you. Your children growing up with somewhere in Ghana that is theirs &mdash; not a hotel, not a relative&rsquo;s spare room.</p>
<p class="moment sans">December means something again. &ldquo;We&rsquo;re going home.&rdquo; And meaning it.</p>
</div>
</div></div>'''),
    B=('From The Long Room &mdash; narrow centred column on cream',
       '''<div class="g-cream" style="padding:2.5rem">
<p class="mv-num">IV &middot; Between two places</p>
<div style="max-width:44rem;margin-inline:auto;text-align:left">
<h2 class="t-display">Maybe home doesn&rsquo;t have to mean choosing one country over another.</h2>
<p class="body">A key that is yours. A room that remembers you. Your children growing up with somewhere in Ghana that is theirs &mdash; not a hotel, not a relative&rsquo;s spare room.</p>
<p class="moment">December means something again. &ldquo;We&rsquo;re going home.&rdquo; And meaning it.</p>
</div></div>'''),
    C=('From Four Rooms &mdash; sticky statement with inline serif',
       '''<div class="g-dark" style="padding:2.5rem">
<p class="mv-num">IV &middot; Between two places</p>
<div class="split split-l">
<div class="sticky">
<p class="kicker">For those who live between two places</p>
<h2 class="t-stmt">Maybe home doesn&rsquo;t have to mean <span class="em">choosing one country</span> over another.</h2>
</div>
<div>
<p class="body">A key that is yours. A room that remembers you. Your children growing up with somewhere in Ghana that is theirs &mdash; not a hotel, not a relative&rsquo;s spare room.</p>
<p class="moment">December means something again. &ldquo;We&rsquo;re going home.&rdquo; And meaning it.</p>
</div>
</div></div>'''),
)

S['s11'] = dict(
    title='Three ways in', mv='IV',
    note='Stay / Own / Partner. Note this sits at position 12 of 12 on the live page &mdash; flag if you want it moved up.',
    A=('From The Ledger &mdash; four-column rows',
       '''<div class="g-dark" style="padding:2.5rem">
<p class="mv-num">IV &middot; Three ways in</p>
<h2 class="t-stmt">Stay. Own. Partner.</h2>
<div class="ways-rows">
<article><span class="n num">01</span><h3>Stay</h3><p>Book a visit. Feel the village before you decide anything.</p><a href="#">Explore stays &rarr;</a></article>
<article><span class="n num">02</span><h3>Own</h3><p>Explore ownership &mdash; the residence, the operation, the numbers.</p><a href="#">See ownership &rarr;</a></article>
<article><span class="n num">03</span><h3>Partner</h3><p>Bring land, capital, or operations. Build a hub with us.</p><a href="#">Explore partnership &rarr;</a></article>
</div>
</div>'''),
    B=('From The Long Room &mdash; stacked on cream',
       '''<div class="g-cream" style="padding:2.5rem">
<p class="mv-num">IV &middot; Three ways in</p>
<h2 class="t-display">Stay. Own. Partner.</h2>
<div class="ways-stack">
<article><p class="n num">01</p><h3 class="t-h3">Stay</h3><p>Book a visit. Feel the village before you decide anything.</p><a href="#">Explore stays &rarr;</a></article>
<article><p class="n num">02</p><h3 class="t-h3">Own</h3><p>Explore ownership &mdash; the residence, the operation, the numbers.</p><a href="#">See ownership &rarr;</a></article>
<article><p class="n num">03</p><h3 class="t-h3">Partner</h3><p>Bring land, capital, or operations. Build a hub with us.</p><a href="#">Explore partnership &rarr;</a></article>
</div>
</div>'''),
    C=('From Four Rooms &mdash; sticky title, ruled list right',
       '''<div class="g-dark" style="padding:2.5rem">
<p class="mv-num">IV &middot; Three ways in</p>
<div class="split split-l">
<div class="sticky"><h2 class="t-stmt">Stay. <span class="em">Own.</span> Partner.</h2></div>
<div class="ways-stack" style="margin-top:0">
<article><p class="n num">01</p><h3 class="t-sans-h3">Stay</h3><p>Book a visit. Feel the village before you decide anything.</p><a href="#">Explore stays &rarr;</a></article>
<article><p class="n num">02</p><h3 class="t-sans-h3">Own</h3><p>Explore ownership &mdash; the residence, the operation, the numbers.</p><a href="#">See ownership &rarr;</a></article>
<article><p class="n num">03</p><h3 class="t-sans-h3">Partner</h3><p>Bring land, capital, or operations. Build a hub with us.</p><a href="#">Explore partnership &rarr;</a></article>
</div>
</div></div>'''),
)

S['s12'] = dict(
    title='The ask', mv='IV',
    note='The only gold-gradient moment on the page. Where it lands is the last decision.',
    A=('From The Ledger &mdash; dark, centred, image behind',
       '''<div class="final-dark g-dark" style="padding:4rem 2.5rem;position:relative;overflow:hidden">
<img src="../assets/dusk-cta-desktop.webp" alt="Illustrative reference of a timber residence with deck at dusk" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.3">
<div style="position:absolute;inset:0;background:oklch(.19 .011 285 / .68)"></div>
<div style="position:relative">
<p class="kicker">Your next step</p>
<h2>You don&rsquo;t need to decide today. You need enough information to decide well.</h2>
<p>No checkout. No countdown timer. No pressure on the call. Just a structured conversation about whether this fits the life you&rsquo;re building.</p>
<a class="btn btn-gold" href="#">Request a private briefing</a>
<p class="credits-line" style="margin-top:2rem">All imagery on this page is illustrative reference</p>
</div></div>'''),
    B=('From The Long Room &mdash; cream, serif display',
       '''<div class="final-cream g-cream" style="padding:4rem 2.5rem">
<p class="kicker">Your next step</p>
<h2>You don&rsquo;t need to decide today. You need enough information to decide well.</h2>
<p>No checkout. No countdown timer. No pressure on the call. Just a structured conversation about whether this fits the life you&rsquo;re building.</p>
<a class="btn btn-gold" href="#">Request a private briefing</a>
<p class="credits-line" style="color:oklch(.19 .011 285 / .38)">All imagery on this page is illustrative reference</p>
</div>'''),
    C=('From Four Rooms &mdash; the gold gradient card',
       '''<div class="final-card">
<div>
<p class="kicker" style="color:oklch(.19 .011 285 / .62)">Your next step</p>
<h2>You don&rsquo;t need to decide today. You need enough information to decide well.</h2>
<p>No checkout. No countdown timer. No pressure on the call. Just a structured conversation about whether this fits the life you&rsquo;re building.</p>
<a class="btn" href="#">Request a private briefing</a>
</div>
<div class="side">
<strong>What the briefing covers</strong>
<ul>
<li>What you acquire, and the rights</li>
<li>What we manage, what stays yours</li>
<li>Revenue and costs, line by line</li>
<li>The assumptions behind every projection</li>
<li>What happens if you want to exit</li>
</ul>
</div>
</div>'''),
)

# ── page template ───────────────────────────────────────────────────────
TPL = '''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{sid} &middot; {title} &mdash; Swift Horizon homepage rebuild</title>
<link rel="stylesheet" href="../assets/tokens.css">
<link rel="stylesheet" href="_lib.css">
<style>
.pv {{ scroll-margin-top: 4.5rem; }}
</style>
</head>
<body data-section="{sid}">
<header class="top">
  <div class="top-in">
    <a href="../index.html">&larr; All sections</a>
    <span class="who" id="who">nothing chosen</span>
  </div>
</header>

<div class="pv" data-variant="a">
  <div class="pv-head">
    <span class="l">A</span>
    <span><span class="n">{title}</span> &middot; <span class="from">{afrom}</span></span>
    <button class="pick" data-pick="a">Choose A</button>
  </div>
  <div class="pv-body">{abody}</div>
</div>

<div class="pv" data-variant="b">
  <div class="pv-head">
    <span class="l">B</span>
    <span><span class="n">{title}</span> &middot; <span class="from">{bfrom}</span></span>
    <button class="pick" data-pick="b">Choose B</button>
  </div>
  <div class="pv-body">{bbody}</div>
</div>

<div class="pv" data-variant="c">
  <div class="pv-head">
    <span class="l">C</span>
    <span><span class="n">{title}</span> &middot; <span class="from">{cfrom}</span></span>
    <button class="pick" data-pick="c">Choose C</button>
  </div>
  <div class="pv-body">{cbody}</div>
</div>

<script src="_pick.js"></script>
</body>
</html>
'''

for sid, d in S.items():
    afrom, abody = d['A']
    bfrom, bbody = d['B']
    cfrom, cbody = d['C']
    html = TPL.format(sid=sid, title=d['title'],
                      afrom=afrom, bfrom=bfrom, cfrom=cfrom,
                      abody=abody, bbody=bbody, cbody=cbody)
    path = os.path.join(OUT, sid + '.html')
    open(path, 'w').write(html)
    print('wrote', sid + '.html')
print('done:', len(S), 'sections')