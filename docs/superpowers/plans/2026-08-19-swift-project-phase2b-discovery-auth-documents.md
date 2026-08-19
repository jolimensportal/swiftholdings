# Plan 2b — The Swift Project: Discovery Form, Auth, and Gated Documents

Date: 2026-08-19
Repo: swift-holdings/DataNova
Deploy: git push origin main → Cloudflare Pages (swiftholdings.pages.dev)

## Context

Phase 2 of the rebrand. Plan 1 (public 10-page site) is LIVE. Plan 2 adds:

1. A 5-step Discovery Form replacing BriefingForm (approved design: spec section "Discovery Form (5 Steps)" + mockup `.superpowers/brainstorm/20342-1787064884/content/section3-discovery-form.html`).
2. Password-based member accounts + sessions (Astro Sessions API + Cloudflare KV).
3. Gated long-form documents behind login.

Craft bar: the form is a dark obsidian panel with gold-line border, Cormorant display moments, green-check inline validation, tabular numerals. Must not look templated.

## Locked decisions

- **Auth:** Astro Sessions (unstorage cloudflareKVBinding driver; adapter option `sessionKVBindingName: 'SESSION'`). Members stored in KV as keys `member:<email>` → JSON { name, email, hashedPassword, salt, iterations, createdAt }. PBKDF2-SHA256 via WebCrypto (100k iterations, 16-byte salt, base64). No new deps.
- **Password:** user chooses it at Step 4. Submit creates member + auto-login session. No SMTP exists → confirmation states gates are open; document this deviation in the confirmation copy and plan.
- **PDF:** print stylesheet + `window.print()`. Server-side PDF deferred.
- **Deploy prerequisite:** user must create KV namespace `SESSION` and bind it to the Pages project in the Cloudflare dashboard (wrangler not authenticated). Without it, session endpoints 500.
- **Rate limiting:** reuse `src/utils/rate-limit.ts` (rateLimit + getClientIp).
- **Astro v7:** `import { env } from 'cloudflare:workers'` (locals.runtime.env removed).
- **Session data:** `src/types/session-data.d.ts` augments `App.SessionData` with `memberEmail?: string`.
- **Email normalization:** lower-case; `member:<email>` keys.
- **No forbidden strings:** keep aligned with `no-forbidden-strings.test.ts` conventions.

## Task 1 — Discovery domain module (TDD)

Files: `src/data/marketing/discovery.ts`, `src/data/marketing/discovery.test.ts`

- Types: Segment = 'local' | 'diaspora' | 'institutional'; Intent = 'prefab' | 'ecosystem' | 'stay' | 'exploring'.
- Segment data: labels + descriptions (Local Ghanaian / Diaspora Partner / Institutional Fund).
- Intent data: labels; branching: prefab → owner brackets; ecosystem → fund brackets; stay → no bracket; exploring → 'None yet'.
- Brackets: owner $50–100K / $100–250K / $250–500K / $500K–1M / $1M+; fund $1M–5M / $5M–10M / $10M–25M / $25M+.
- Timezones: PST −8, EST −5, GMT 0, CET +1, HKT +8, JST +9 (label + offset).
- Functions: `getBrackets(segment, intent)` → string[]; `validateDiscoveryInput(input)` → { ok: true } | { ok: false, errors: Record<string, string> } covering required name/email/password, email format, optional phone format, password policy (≥10 chars, upper+lower+digit), bracket ∈ segment's list, timezone ∈ list, slot date is a next-business-day date.
- Tests: happy path each segment×intent bracket set; every validation error; timezone list integrity.

## Task 2 — Password hashing (TDD)

Files: `src/lib/auth/password.ts`, `src/lib/auth/password.test.ts`

- `hashPassword(password)` → { hash, salt, iterations } (base64; PBKDF2-SHA256, 100k iters, 16B salt).
- `verifyPassword(password, record)` → boolean.
- Tests: correct password true; wrong false; empty rejected; salts unique per hash; verify against known vector.

## Task 3 — Member store + session helpers (TDD)

Files: `src/lib/auth/members.ts`, `src/lib/auth/members.test.ts`, `src/lib/auth/session.ts`, `src/types/session-data.d.ts`

- members.ts: `createMember(env, { name, email, password })` (error if email exists), `getMemberByEmail(env, email)`, `toMemberView` (strip hash).
- session.ts: `getMemberEmail(session)`, `setMemberSession(session, email)` (TTL 7 days), `clearMemberSession(session)`.
- session-data.d.ts: `declare namespace App { interface SessionData { memberEmail?: string } }`.
- Tests inject a Map-based stub env; never touch real KV.

## Task 4 — API endpoints + middleware

Files: `src/pages/api/discovery.ts`, `src/pages/api/login.ts`, `src/pages/api/logout.ts`, `src/middleware.ts`

- POST /api/discovery: validate (Task 1), rate-limit per IP, create member if new, set session, return { ok: true, member: { name, email } }.
- POST /api/login: rate-limit, find member, verify, set session; 401 { ok: false, error } on failure.
- POST /api/logout: destroy session.
- middleware.ts: gate `/members/*` — no session → redirect `/login?next=<path>`; never block API/assets/public pages.
- All endpoints: require JSON content-type, check Origin matches host, 405 on non-POST.

## Task 5 — Login page

File: `src/pages/login.astro`

- Dark obsidian panel, gold-line border, Cormorant "Welcome back" display, Manrope body. Email + password + inline errors; honors `?next=` redirect; link to /briefing for new members. Not templated: asymmetric split, gold underline accent.

## Task 6 — DiscoveryForm.client.tsx

File: `src/components/marketing/DiscoveryForm.client.tsx`

- 5 steps, progress indicator (gold active), step transitions animated.
- Step 1 segmented control (3 segments); Step 2 intent cards (4); Step 3 adaptive bracket select via getBrackets; Step 4 name/email/phone/password with green-check inline validation; Step 5 timezone select + next-business-day slot chips + "Secure global sync — end-to-end encryption active" lock glyph + submit.
- Confirmation state: "You are in" — gold check, member name, "Download the Partnership Summary" (primary) + "Go to documents" (secondary).
- Accessibility: fieldsets + legends, aria-live step announcements, focus management, aria-describedby errors.
- No forbidden strings; copy from spec.

## Task 7 — Briefing page rebuild

File: `src/pages/briefing.astro`; delete `src/components/marketing/BriefingForm.astro`

- Keep asymmetric hero; swap form for DiscoveryForm island; copy per spec.

## Task 8 — Documents content collection + content

Files: `src/content.config.ts` (documents collection, markdoc), `src/content/documents/{partnership-summary,investor-summary,modular-hospitality,legal-dossier}.mdoc`

- Author 4 long-form docs from `/tmp/swift_ocr/*.txt` (page-marked OCR) + `/tmp/swift_docs/*.txt` blueprints. Brand numbers must match site.ts (70/30, $50,000, stats, contacts, capsule specs).
- Legal dossier: disclaimers, accredited-investor language, withdrawal windows, dispute resolution (Ghana law), regulatory notice.

## Task 9 — Members hub page

File: `src/pages/members/index.astro`

- Gated. Greets member by name; asymmetric document cards; latest briefing placeholder; sign-out.

## Task 10 — Gated document renderer + print

Files: `src/pages/members/documents/[slug].astro`, `src/styles/print.css`

- Fetch doc by slug, 404 if missing; refined prose (serif display title, metadata ledger, generous measure). "Download PDF" → window.print(). Print CSS: black-on-white, brand block, no nav.

## Task 11 — Full gate + deploy

- Verify /members/* redirects logged out; briefing submit → auto-login → hub → doc → print.
- `pnpm test` all green (existing 42 + new suites), `astro check` 0 errors, prettier changed files, `pnpm build`.
- Ask user to create/bind KV SESSION (or verify done); push; live-verify login, gated doc, redirects on production.

## Verification commands

```
export PATH="$HOME/.nvm/versions/node/v22.23.2/bin:$PATH"
pnpm test
pnpm astro check        # needs ≥300s timeout
pnpm build              # then python3 -m http.server 4321 --directory dist/client for visual QA
pnpm prettier --check   # changed files only
```

## Non-goals

SMTP/email delivery, password reset, server-side PDF, portal dashboard (Plan 3), content editing from UI.