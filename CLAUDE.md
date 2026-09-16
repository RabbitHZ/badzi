# Badzi

GitHub README badge generator. Next.js 15 (App Router) + React 19 + TypeScript
frontend; backend REST API at `https://api.badzi.app`.

## Structure

- `app/` — routes: `/` (landing), `/styles`, `/shop`, `/shop/[id]`, `/pricing`,
  `/docs`, `/signin`. Plus SEO files (`opengraph-image`, `sitemap`, `robots`).
- `components/` — `badzi-landing.tsx` (landing), `site-header.tsx` (shared nav),
  `page-shell.tsx` (nav-page layout), scoped CSS files, `ui/` (shadcn).
- `lib/` — `api.ts` (API client + `API_BASE` + `badgeUrl`), `types.ts` (OpenAPI types).
- `docs/` — local working notes (`requirements.md`, `PLAN.md`); gitignored.

## Key conventions

- **API base = `NEXT_PUBLIC_API_BASE`** (`.env.local`, default `https://api.badzi.app`).
  Never hardcode a host; import `API_BASE` from `lib/api.ts`.
- Dark theme via `.badzi` CSS tokens; new pages go inside `<PageShell>`.
- Auth/purchase are **UI-only stubs** for now — don't wire real flows without a go-ahead.
- **Never `npm run build` (or `rm -rf .next`) while `next dev` runs** — it breaks
  the running server's CSS. Stop dev first.

Full rules: `.claude/rules/badzi-architecture.md`.

## Workflow

- Dev server: `/dev` (or `npm run dev`, http://localhost:3000).
- Verify a page renders: `/verify-ui <route>` (uses Playwright MCP from `.mcp.json`).
- Package manager: **npm**.

## Backend

OpenAPI at `<API_BASE>/v3/api-docs`, Swagger UI at `<API_BASE>/swagger-ui/index.html`.
Groups: Auth, Users, Shop, Payments, BadgeStyles, Badge, ViewCount. Responses are
wrapped in `ApiResponse<T>` (`lib/api.ts` unwraps `.data`).
