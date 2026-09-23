This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Analytics and error tracking

[PostHog](https://posthog.com) is wired up in `src/instrumentation-client.ts` for pageview analytics and client-side error tracking. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_POSTHOG_KEY` to your project API key to enable it; without a key, PostHog stays disabled (e.g. local development). Because this site is a static export, PostHog config is baked in at `next build` time, so the env var must be set wherever the build runs (CI/deploy), not just at runtime.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy

This site builds to a static export (`output: "export"` in `next.config.ts`) and ships to Cloudflare as static assets — no Worker script, just the `./out` directory declared in `wrangler.jsonc`.

`.github/workflows/ci.yml` runs lint, type-check, unit tests, and Playwright e2e on every push and pull request. On a push to `main`, once all of those pass, a `deploy` job builds the site and runs `wrangler deploy` via [`cloudflare/wrangler-action`](https://github.com/cloudflare/wrangler-action). That job needs two repository secrets:

- `CLOUDFLARE_API_TOKEN` — a token scoped to "Edit Cloudflare Workers" on this account only.
- `CLOUDFLARE_ACCOUNT_ID` — the Cloudflare account ID that owns the `kylemonti-com` Worker.

`NEXT_PUBLIC_POSTHOG_KEY` is an optional third secret; set it to bake PostHog analytics into the deployed build (see Analytics above). Leaving it unset keeps PostHog disabled on the live site, same as local development without `.env.local`.

To deploy manually from a machine with `wrangler` authenticated: `npm run build && npx wrangler deploy`.
