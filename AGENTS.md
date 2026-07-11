# AGENTS.md

## Cursor Cloud specific instructions

This is a Next.js 15 (App Router) + React 19 photo gallery & guestbook app named `patik`. There is a single service (the Next.js app). Standard scripts live in `package.json` (`dev`, `build`, `start`, `lint`).

- **Run (dev):** `npm run dev` starts the app on `http://localhost:3000`. This is the primary way to develop and test.
- **Storage mode is automatic.** With no Supabase env vars set, the app runs in `local` mode and persists data to the filesystem (`data/*.json` and uploaded images under `public/uploads/`), both git-ignored. `GET /api/status` returns the active mode (`{"mode":"local"}` or `{"mode":"supabase"}`). To use Supabase instead, copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` (schema in `supabase/schema.sql`); no Supabase is required for local development/testing.
- **`npm run lint` is not usable non-interactively.** No ESLint config is committed, so `next lint` prompts to set one up and blocks on TTY input. Skip it or configure ESLint separately; do not rely on it in automated checks.
- **`npm run build` currently fails** on a stray, unused `page.tsx` at the repo root (a leftover Supabase quickstart file importing `@/utils/supabase/server`, which does not resolve since `@/*` maps to `./src/*`). This is unrelated to environment setup — the real app is under `src/app/`. `npm run dev` compiles routes on demand and is unaffected. Do not "fix" this as part of environment setup unless asked.
- **Key API routes:** `src/app/api/photos` (GET/POST multipart upload), `src/app/api/guestbook` (GET/POST JSON), `src/app/api/status` (GET mode).
