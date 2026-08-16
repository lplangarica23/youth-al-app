# youth.al — the real app (Next.js + Supabase + AI)

This version implements the MVP from the youth.al strategy document: structured opportunity data with a real, explainable **eligibility engine** (not a black-box AI score), verification status on every listing, and personalized search/Swipe Mode that reasons over that structured data.

**Important:** this was written carefully but not run/tested end-to-end (this environment has no internet access to install packages or start a dev server). Follow the steps below on your own machine — if something errors, copy the exact error message back, or open this folder in Claude Code and I can debug it live.

## ⚖️ Before you launch anything real: read this

The strategy document itself is explicit about this, and it's worth repeating here directly: **this is a product plan, not legal advice.** Before real users sign up, you need an Albanian-qualified lawyer or data-protection professional to review your actual data handling, terms of service, privacy notice, age policy, and use of a third-party AI provider (currently Google's Gemini API) — Albania's Law No. 124/2024 substantially aligns with GDPR, and that's not optional paperwork, it's a real requirement. This app collects profile data (age, interests, experience) specifically to power the matching engine — treat that as a real responsibility, not a technicality. Worth flagging specifically: Gemini's free tier terms allow using submitted prompts to improve Google's models — that needs to be disclosed plainly in your privacy policy, not glossed over. I can help you draft a starting-point privacy policy or terms of service when you're ready, but a professional needs to review it before it's real.

**An 18+ confirmation is implemented and enforced** — signup requires checking a box confirming the person is 18+, recorded in the database (`profiles.confirmed_18_plus`, `confirmed_18_plus_at`) with a real timestamp, not just a UI checkbox that leaves no trace. This is self-attestation (the person could technically lie), not verified ID checking — a bigger, separate undertaking if ever needed.

**Per-user daily AI rate limit** — 40 AI requests/day per person (chat messages + AI parsing combined), tracked in `profiles.ai_calls_today`. This protects your shared free Gemini quota (~1,500/day for the *entire app*) from being exhausted by one heavy or abusive user before anyone else gets to use it that day. Adjust the `DAILY_AI_LIMIT` constant in `src/lib/rateLimit.ts` once you have a real sense of typical usage.

**`/privacy` and `/terms` pages now actually exist on the site** — rendering the draft policy/terms content with a clear "draft, pending legal review" banner at the top of each. Linked from a new footer (this app had no footer at all before) and from the signup form. Still drafts — the banner is intentional and should stay until a lawyer finalizes them.

---

## If you already have the app running (schema update needed)

You have schema updates to run if you're coming from an earlier version — open Supabase → SQL Editor → New query, and run whichever blocks from the bottom of `supabase/schema.sql` you haven't run yet (each is clearly marked with a comment header: the single-search pivot, the eligibility engine, and now the application tracker). All are additive and safe to run even if some columns already exist (`add column if not exists`) — running one twice does nothing harmful.

## Starting fresh

Create a Supabase project, run the **entire** `supabase/schema.sql` (all three layers are in one file now: original schema, single-search pivot, eligibility engine), set up `.env.local` from `.env.local.example`, `npm install`, `npm run dev`.

## Get a Gemini API key (needed for AI-assisted submission and chat)

**Heads up before you start:** Google renames and retires Gemini models unusually fast — faster than most other AI providers. If the chat or AI parsing ever suddenly starts erroring with something like "model not found" or "no longer available," that's almost certainly this, not a real bug. Fix: check the current model list at [ai.google.dev/gemini-api/docs/models](https://ai.google.dev/gemini-api/docs/models) and update the `model:` string in `src/app/api/chat/route.ts` and `src/app/api/parse-listing/route.ts` — that one line in each file is the only thing that ever needs to change.

1. Go to [aistudio.google.com](https://aistudio.google.com) → sign in with a Google account → **Get API key** → create a new key
2. Add it to `.env.local`: `GEMINI_API_KEY=...`
3. **Genuinely free**, no credit card needed, generous daily limits for an early-stage app (roughly 1,500 requests/day on the free tier as of when this was written — check Google's current published limits, since these do change). One real tradeoff: on the free tier, Google's terms allow using your prompts to help train their models. That's worth disclosing in your privacy policy honestly, not hiding.
4. Without this set, `/submit`'s AI parsing shows an error (manual entry still works), and the homepage chat shows a clear "not configured" message instead of crashing.
3. Real, paid API — cheap per use, not free. Without it, `/submit` still works via manual entry.

## Deploying

Push to GitHub, import on Vercel, add environment variables (including `GEMINI_API_KEY` if you want AI parsing and chat live), deploy.

---

## What's already working

- **Forgot password, actually working** — this was a real, basic gap: `/login` now has a "Harrove fjalëkalimin?" link → `/forgot-password` (send reset email) → `/reset-password` (set a new one, with proper handling of the recovery link's timing so the form doesn't try to submit before the reset session is actually ready).
- **Profile pictures** — real image upload via Supabase Storage, not just a UI mockup. Uploads are validated (image files only, 3MB max), stored under a per-user folder with storage-level security rules so people can only ever upload/change their *own* avatar (enforced by the database, not just hidden UI), and the photo now shows in the header dropdown and profile page.

- **Profile settings** (`/profile`) — a real gap I found and fixed: previously there was no way to update your interests/city/age/experience after onboarding, and clicking your own name in the header instantly logged you out with no confirmation. Now there's an actual profile page, and the header has a proper dropdown (Profili / Dil) instead of an instant-logout button.
- **Loading states everywhere** — every real page (search, swipe, saved, opportunities, submit, profile) now shows a branded spinner during navigation instead of a blank flash.
- **Branded error pages** — a real 404 page and a real error boundary, instead of Next.js's generic defaults, so a broken link or a crash still feels like part of the app rather than a dead end.
- **"New conversation" in chat** — you can now restart the AI chat without reloading the whole page.

- **Conversational chat search (the homepage itself)** — this is the doc's Section 6 ("The AI Conversation") and Section 7 ("What Can I Do?") actually implemented. Type a natural sentence like "kam nevojë për një punë si kamarier" instead of matching exact keywords. The AI is given the real, current opportunity list as its *only* source of truth and is explicitly instructed never to mention anything outside it — every card shown is re-fetched fresh from the database server-side, never rendered from the AI's own text, so it can't hallucinate a fake listing even if it tried.
  - **Requires login** — same reasoning as the AI submission tool: this costs a real API call per message, and gating behind an account is cheap, simple abuse protection.
  - **Cost is higher per message than the submission parser**, because the whole current catalog gets sent as context each time (currently cheap at 6 listings; worth watching as the catalog grows — see the note directly in `src/app/api/chat/route.ts` about the retrieval-based upgrade path once this scales past a few hundred listings).
  - Classic keyword search still exists at `/search` as a fallback/secondary option, linked from the chat.

- **Mobile navigation** — fixed a real bug: the header previously had no way to navigate on phone-width screens at all. Now uses a native `<details>` menu, same reliable pattern as the original static site.
- **Save button, everywhere** — a ★ toggle now appears on every opportunity card (search, browse-all), not just via Swipe Mode. Saving works the same way from any of the three surfaces.
- **`/saved` — "Të Ruajturat"** — a lightweight application tracker (the doc's "Opportunity Journey," Section 13, scoped small). Every saved opportunity can be marked 🔖 Ruajtur → ✍️ Duke aplikuar → ✅ Aplikuar, with a direct link to the application. This is intentionally simple — not the full guided "Application Copilot" from the doc, just enough to answer "where am I with each thing I saved."

- **Search** (`/search`, and the homepage): full-text search, personalized ranking (interest match + past-save behavior + deadline urgency + eligibility fit)
- **Eligibility engine** (`lib/eligibility.ts`): every opportunity card shows a deterministic, explainable "Why You?" checklist — age fit, experience requirement, interest match — computed from real structured fields, never guessed by an LLM. This is the doc's core safety principle (Section 32) actually implemented, not just described.
- **Trust/verification badges**: every opportunity shows a verification status (🟢 verified / 🟡 needs verification / 🔴 expired / ⚠️ community reported) and funding badges (travel/accommodation/food covered)
- **Onboarding** (`/onboarding`): now 5 taps — interests, city, purpose, age, experience level — the minimum needed to power the eligibility engine
- **Personalized Swipe Mode**: deck order now also factors in age/experience eligibility fit, not just category interest
- **AI-assisted submission** (`/submit`): AI now extracts the structured eligibility/funding fields too, with an explicit instruction to use `null`/`false` rather than guess when unsure — a human still reviews and can edit every field before submitting
- Accounts, admin review queue, row-level security, full motion layer — unchanged

## What's next (the doc's own roadmap — don't skip ahead)

Per the doc's Section 39 ("What NOT to Build Initially") and its own 90-day plan, deliberately **not** built yet:
- Conversational AI profile-building (current onboarding is simple taps, not a chat) — genuinely nice upgrade, not required for MVP
- Automated verification monitoring (checking source URLs for changes) — valuable later, real engineering effort
- Application Copilot, Youth Passport, reputation system, opportunity graph — all explicitly "later" in the doc itself
- Alerts/notifications when new matching opportunities appear — needs email infrastructure, next logical piece after this
- A mobile hamburger menu — still missing, still worth fixing soon

## Project structure

```
src/
  app/
    page.tsx              Homepage — the single search bar
    search/                Search results (personalized ranking + eligibility)
    onboarding/            5-tap profile setup (now includes age, experience)
    swipe/                 Personalized Swipe Mode
    submit/                AI-assisted + manual submission form (now with eligibility fields)
    admin/                 Approve/reject pending submissions
    api/parse-listing/     AI parsing endpoint — now extracts eligibility/funding fields too
  components/
    OpportunityCard.tsx      Now shows verification badge + funding badges + eligibility checklist
  lib/
    eligibility.ts           The "Why You?" engine — deterministic, explainable, read this first
    ranking.ts               Personalization scoring, now eligibility-aware
    supabase/, types.ts
supabase/
  schema.sql                 Full schema: original + pivot + eligibility engine, all in one file
scripts/
  seed.mjs                   Sample opportunities, now with realistic eligibility/funding data
```
