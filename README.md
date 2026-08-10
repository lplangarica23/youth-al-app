# youth.al — the real app (Next.js + Supabase)

This is Phase 1 from the plan: accounts + Opportunities, backed by a real database. Swipe Mode now persists your saves if you're logged in, and NGOs can (eventually) submit their own listings instead of you hand-editing a file.

**Important:** this was written carefully but not run/tested (this environment has no internet access to install packages or start a dev server). Follow the steps below on your own machine — if something errors, copy the exact error message back to me, or open this folder in Claude Code and I can debug it live.

## 1. Create your Supabase project

1. Go to [supabase.com](https://supabase.com) → sign up free → "New project"
2. Once it's created, go to **SQL Editor** → **New query**
3. Paste in everything from `supabase/schema.sql` and click **Run**. This creates all the tables (profiles, opportunities, saved_opportunities) and the security rules that control who can read/write what.
4. Go to **Settings → API**. You'll need two values from this page in the next step.

## 2. Set up your local environment

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in:
- `NEXT_PUBLIC_SUPABASE_URL` — the "Project URL" from Settings → API
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — the "anon public" key from the same page

## 3. Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You should see the homepage. `/opportunities` will be empty until you seed it (next step) or submit something.

## 4. Load the sample opportunities (optional but recommended)

This copies the same example listings from the old static site into your new database, so you're not starting from a blank page.

1. In Supabase, go to **Settings → API**, copy the **service_role** key (this one is secret — never share it or commit it)
2. Add it to `.env.local` as `SUPABASE_SERVICE_ROLE_KEY=...`
3. Run:
```bash
npm run seed
```

## 5. Deploy it

1. Push this folder to a new GitHub repository
2. Go to [vercel.com](https://vercel.com) → sign up free → "Add New Project" → import your repo
3. In Vercel's project settings, add the same two `NEXT_PUBLIC_...` environment variables from step 2
4. Deploy. Vercel gives you a live URL immediately, and redeploys automatically every time you push to GitHub
5. Once it's live, connect your `youth.al` domain the same way you would have with GitHub Pages: Vercel → Project Settings → Domains → add `youth.al`, then update your domain's DNS records with the values Vercel shows you

## What's already working

- Accounts: sign up, log in, log out (email + password, with an email confirmation step)
- Opportunities: browse, filter, search — reading from a real database now, not a hardcoded file
- Swipe Mode: same drag-to-swipe game, but now saves persist to your account if you're logged in, with a confetti burst on every save
- **NGO/user submissions** (`/submit`): logged-in users can submit a new opportunity, which goes in as "pending" — not public until approved
- **Admin review** (`/admin`): approve or reject pending submissions. Only emails listed in `ADMIN_EMAILS` (see `.env.local.example`) can access this page
- Row-level security: the database itself enforces who can see/edit what — not just the app code
- The full motion layer carried back over from the static site: ambient drifting background blobs, a cursor-following glow in the hero, entrance animations, a sticker-tape marquee ticker, scroll-triggered reveal animations, and the confetti burst on Swipe Mode saves

## What's next (not built yet)

- Housing, Travel Together, Meetups, Sharing — still "Coming Soon" only, same as before
- Passwordless/social login (Google, etc.) — Supabase supports this, just needs to be turned on
- Notifications when a submission is approved/rejected (right now the submitter has no way to know except checking `/opportunities` themselves)
- A nicer 3D card-tilt hover effect on opportunity cards (the static site had this; it's a nice-to-have, not blocking anything)

## Project structure

```
src/
  app/                    Pages (Next.js App Router)
    page.tsx              Homepage
    opportunities/        Browse/filter/search
    swipe/                Swipe Mode
    submit/               NGO/user submission form (requires login)
    admin/                Approve/reject pending submissions (ADMIN_EMAILS only)
    login/, signup/       Auth forms
    auth/                 Auth route handlers (don't need editing)
  components/             Reusable UI pieces
    AmbientBlobs.tsx      Background glow blobs
    CursorGlow.tsx        Cursor-following glow in the hero
    Marquee.tsx           Sticker-tape ticker
    Reveal.tsx            Scroll-triggered fade-in wrapper
  lib/
    supabase/              Supabase client setup (don't need editing)
      admin.ts             Service-role client + ADMIN_EMAILS check, server-only
    types.ts               Shared TypeScript types
supabase/
  schema.sql               Run this once in the Supabase SQL editorr
scripts/
  seed.mjs                 Loads sample opportunities into your database
```
