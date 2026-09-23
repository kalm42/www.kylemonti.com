# kylemonti.com

Kyle Monti's personal site: a home page, a blog, a résumé, and a "workshop" page linking out to small side projects. Built with Next.js (Pages Router), Tailwind, and TypeScript; ships as a static export to Cloudflare.

## Stack

- **Next.js 16** (Pages Router, not App Router) with `output: "export"` — the whole site builds to static HTML, there is no server at runtime.
- **React 19** with the React Compiler enabled (`reactCompiler: true` in `next.config.ts`).
- **Tailwind CSS v4**, styled per the design system in [`DESIGN.md`](./DESIGN.md).
- **TypeScript**, strict, with `~/*` aliased to `src/*` (see `tsconfig.json`).
- **Zod** for validating data at boundaries (blog frontmatter, first-party API responses).
- **`@tanstack/markdown`** for parsing blog post Markdown + frontmatter, **`@tanstack/highlight`** for code syntax highlighting.
- **PostHog** for pageview analytics and client-side error tracking.
- **Vitest** + Testing Library for unit/integration tests, **Playwright** for e2e, **MSW** for mocking network requests in both.
- **Wrangler** to deploy the static export to Cloudflare.

Read [`AGENTS.md`](./AGENTS.md) before writing code — this project pins a specific Next.js version whose docs live under `node_modules/next/dist/docs/` and may differ from general Next.js knowledge, and it lays out the coding conventions (file layout, prop typing, Zod-at-the-boundary) that apply throughout `src/`.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.example` to `.env.local` if you want PostHog active locally (see Analytics below); it's optional and the site works fine without it.

## Project structure

```
src/
  pages/            Routes (Pages Router): index, blog/, resume, workshop, _app, _document
  components/        UI components — one per file, named `ComponentNameProps` types
  components/ui/     Small primitives (heading, paragraph)
  shared/            Cross-page utilities: blog loading, date formatting, theme, nav, site config
  content/blog/      Blog posts as Markdown files with frontmatter (title, date, excerpt, tags)
  styles/            Global CSS, design tokens, prose and code-block themes
  mocks/             MSW request handlers, shared between Vitest and the Playwright browser worker
  __tests__/         Vitest unit/integration tests (kept out of src/pages/, see TESTING.md)
e2e/                 Playwright specs
scripts/             Build-time scripts (RSS feed generation)
```

### Pages

- `/` — hero, the two most recent posts, and the workshop project grid.
- `/blog` and `/blog/[slug]` — post index and article pages, statically generated from `src/content/blog/*.md`.
- `/resume` — résumé content, printable.
- `/workshop` — links out to side projects, each living at its own hosted domain (defined in `src/shared/projects.ts`), not a subroute of this site.

### Blog content

Posts are Markdown files in `src/content/blog/`, one per slug (`slug.md` → `/blog/slug`). `src/shared/blog.ts` reads the directory, parses each file's frontmatter with a Zod schema (`title`, `date` as `YYYY-MM-DD`, `excerpt`, comma-separated `tags`), and computes reading time from the source. To add a post, drop a new Markdown file with valid frontmatter into that directory — no registration elsewhere is needed. `scripts/generate-rss.mjs` re-implements the same frontmatter parsing (it can't use the `~/` path aliases or `zod`, since it runs standalone before `next build`) to emit `public/rss.xml`; keep the two in sync if the frontmatter shape changes.

### Design system

[`DESIGN.md`](./DESIGN.md) is the enforced source of truth for color tokens, type, spacing, motion, and copy voice — it's derived from a canonical Claude Artifact and components should be ported to match it exactly rather than improvised. Theme (light/dark) is chosen client-side before first paint by an inline script (`src/shared/theme.ts`, run from `_document.tsx`) reading `localStorage` / `prefers-color-scheme`, so there's no flash of the wrong theme.

## Testing

See [`TESTING.md`](./TESTING.md) for the full rules (Arrange/Act/Assert structure, what to mock, file placement). In short:

- `npm test` — Vitest unit/integration tests (`src/__tests__/`). MSW's Node server is started in `vitest.setup.ts`; only third-party API requests should be mocked.
- `npm run test:e2e` — Playwright specs (`e2e/`), run against the Next dev server with MSW's browser worker enabled. Because the site is a static export, `/api/hello` only exists via MSW in both test runners — it is not a real route.
- `npm run test:e2e:ui` — Playwright's UI mode.

## Other scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Generate `public/rss.xml` (`prebuild`), then build the static export to `./out` |
| `npm run lint` | ESLint (`eslint-config-next` + `typescript-eslint` strict/stylistic) |
| `npm run type-check` | `tsc --noEmit` |
| `npm run format` | Prettier, writing in place |

## Analytics and error tracking

[PostHog](https://posthog.com) is wired up in `src/instrumentation-client.ts` for pageview analytics and client-side error tracking. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_POSTHOG_KEY` to your project API key to enable it; without a key, PostHog stays disabled (e.g. local development). Because this site is a static export, PostHog config is baked in at `next build` time, so the env var must be set wherever the build runs (CI/deploy), not just at runtime.

## CI and deploy

This site builds to a static export (`output: "export"` in `next.config.ts`) and ships to Cloudflare as static assets — no Worker script, just the `./out` directory declared in `wrangler.jsonc`.

`.github/workflows/ci.yml` runs lint, type-check, unit tests, and Playwright e2e as separate jobs on every push and pull request. On a push to `main`, once all of those pass, a `deploy` job builds the site and runs `wrangler deploy` via [`cloudflare/wrangler-action`](https://github.com/cloudflare/wrangler-action). That job needs two repository secrets:

- `CLOUDFLARE_API_TOKEN` — a token scoped to "Edit Cloudflare Workers" on this account only.
- `CLOUDFLARE_ACCOUNT_ID` — the Cloudflare account ID that owns the `kylemonti-com` Worker.

`NEXT_PUBLIC_POSTHOG_KEY` is an optional third secret; set it to bake PostHog analytics into the deployed build (see Analytics above). Leaving it unset keeps PostHog disabled on the live site, same as local development without `.env.local`.

To deploy manually from a machine with `wrangler` authenticated: `npm run build && npx wrangler deploy`.
