# GitHub Copilot instructions for IKA Solution Intranet

Read `AGENTS.md` first. It contains the canonical project conventions and architecture guidance.

## Immediate priorities
- This is a Next.js `16.2.10` App Router app with React `19.2.4`, Tailwind CSS `v4`, and TypeScript.
- Validate changes with `npm run lint` then `npm run build`. There is no test framework configured.
- Do not add a backend, API, database, or auth. All data is static in `data/*.ts`.

## Key conventions
- Pages in `app/*/page.tsx` should use `lib/data.ts` and pass plain props into `components/intranet/*`.
- Do not import `data/*.ts` directly from `components/intranet/*`.
- `Scope` is `'global' | DepartementSlug`; department pages use their slug, home uses `global`.
- Use `@/*` imports outside Next.js internals.
- Prefer `next/image` for images and Tailwind theme tokens from `app/globals.css`.
- Avoid raw hex colors in JSX. Use classes like `bg-brand-navy`, `text-brand-cyan`, `text-brand-muted`, `bg-brand-surface`.
- Use `lucide-react` icons by default; `react-icons` is only used in the footer.

## Known repo quirks
- `app/page.tsx` is active but still being redesigned. Do not rewrite it without confirmation.
- `app/page to come back .tsx` is a stale backup and not part of the routed app.
- `app/organigramme`, `app/histoire`, and `app/Bordereaudesprix` are client-only pages with inline data and are not part of the normal `lib/data.ts` pattern.
- `SiteHeader` contains menu links to routes that are not implemented; avoid introducing or leaving broken navigation.
- `components/intranet/last_home_page section.tsx` has a space in its filename and is imported by the home page.

## Where to look next
- `AGENTS.md` for project rules, data contract, and SPFx migration notes.
- `docs/architecture.md` for architecture reference and component mapping.
