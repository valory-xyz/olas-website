# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Olas Network marketing website — a **Next.js 15** (Pages Router) application that showcases autonomous AI agents, staking programs, and the Olas protocol. The site uses **Strapi** as a headless CMS for editorial content, queries multi-chain **GraphQL subgraphs** for on-chain metrics, and persists those metrics as JSON snapshots in **Vercel Blob storage** that are refreshed by Vercel **cron jobs**.

Stack at a glance: Next.js 15 + React 19, Node 22, TypeScript-first (`.ts`/`.tsx`) with `allowJs` for legacy `.js`/`.jsx`, Tailwind CSS + shadcn/ui (Radix primitives), `graphql-request`, `swr`, `@vercel/blob`, `viem`, `dayjs`.

## Development Commands

Use **yarn** for all commands (preferred in this repo):

```bash
yarn dev            # Start dev server at http://localhost:3000
yarn build          # Production build (postbuild runs next-sitemap)
yarn start          # Start production server
yarn lint           # ESLint
yarn lint:fix       # ESLint with auto-fix
yarn lint:lockfile  # Validate yarn.lock integrity (lockfile-lint)
```

## Architecture

### Directory Structure

- `pages/` — Next.js Pages Router routes
  - `pages/api/refresh-metrics/*.ts` — cron-driven endpoints that fetch from subgraphs and write Vercel Blob snapshots
  - `pages/api/og/[[...slug]].tsx` — dynamic Open Graph image generation (`@vercel/og`)
  - `pages/api/olas/[endpoint].ts` — thin proxy to `OLAS_API_URL` (api.olas.autonolas.tech)
  - `pages/data/index.tsx` — "Data Verification" page; documents the provenance/methodology behind published metrics (e.g. `DailyActiveAgentsInfo`, `BabydegenMetricsInfo`, `MechGlobalsInfo`)
  - `pages/card/index.tsx` — shareable agent/card page
  - Dynamic routes use bracket notation: `[slug].tsx`, `[id].tsx`, `[[...slug]].tsx`
- `components/` — React components organized by page (e.g., `BuildPage/`, `AgentEconomies/`, `HomepageSection/`, `StakingPage/`, `PredictionAgentsTable/`)
  - `components/ui/` — Reusable UI primitives (shadcn/ui patterns over Radix)
  - `components/Layout/` — `Header`, `Footer`, `Menu`, `MenuMobile`, `PageWrapper`, `SectionWrapper`, banners
- `common-util/` — Shared utilities and business logic
  - `common-util/api/` — Subgraph aggregation logic per category (`main-metrics.ts`, `predict/`, `agent-economies/`, `other-metrics/`) plus `index.ts` for Strapi calls (blogs, education articles)
  - `common-util/graphql/` — `client.ts` (GraphQL clients per chain), `queries.ts`, `types.ts` (`MetricWithStatus`, `WithMeta`, `SubgraphMeta`), `metric-utils.ts` (lag detection / stale status helpers)
  - `common-util/snapshot-storage.ts` — Vercel Blob save/get with `mergeWithFallback` semantics
  - Other helpers: `numberFormatter.ts`, `time.ts`, `web3.ts`, `charts.ts`, `og/`, `useFetchApi.ts`, `olasApr.ts`, `calculate7DayAverage.ts`, `subgraph.ts`
- `data/` — Static JSON: `agents.json`, `chains.json`, `tokens.json`, `kits.json`, `useCases.json`, `resources.json`, ABIs in `data/ABIs/`, etc.
- `hooks/` — `usePersistentSWR`, `useWindowWidth`, `useHash`
- `lib/` — `utils.ts` (only the `cn()` helper today)
- `styles/` — Global CSS and Tailwind layers
- `public/` — Static assets (fonts, images, OG images, documents)
- `middleware.ts` — Edge middleware (geo-blocking)
- `vercel.json` — Function limits + cron schedules
- `next-sitemap.config.js` — Adds `/agents/<slug>` paths from `data/agents.json`

### Key Technical Patterns

**Multi-chain GraphQL clients** (`common-util/graphql/client.ts`):
The site queries multiple chains — Ethereum, Gnosis, Base, Optimism, Mode, Celo, Arbitrum, Polygon — through these client groups:
- `TOKENOMICS_GRAPH_CLIENTS`, `STAKING_GRAPH_CLIENTS`, `REGISTRY_GRAPH_CLIENTS`, `MARKETPLACE_GRAPH_CLIENTS`, `BABYDEGEN_GRAPH_CLIENTS`, `MECH_FEES_GRAPH_CLIENTS`, `LIQUIDITY_GRAPH_CLIENTS`, `BALANCER_GRAPH_CLIENTS`
- Standalone clients: `predictAgentsGraphClient`, `polymarketAgentsGraphClient`, `legacyMechFeesGraphClient`, `autonolasGraphClient`

Coverage varies by category (e.g. `BABYDEGEN_GRAPH_CLIENTS` only has Optimism + Mode; `BALANCER_GRAPH_CLIENTS` only Gnosis + Polygon). Always check the client map before assuming a chain is queryable.

**Snapshot-based metrics pipeline** (the dominant pattern — replaces ad-hoc CDN-cached API routes):
1. Vercel cron triggers `pages/api/refresh-metrics/<category>.ts` on the schedule defined in `vercel.json`.
2. The handler calls a `fetch*` function in `common-util/api/<category>` that runs all subgraph queries via `Promise.allSettled` (with parallel `getChainBlockNumber` calls for lag detection) and returns a `{ data, timestamp }` snapshot of `MetricWithStatus<T>` values.
3. `saveSnapshot({ category, data })` in `common-util/snapshot-storage.ts` merges with the previous blob via `mergeWithFallback` (keeps the last valid value when the new value is null/stale and marks `status.stale = true`), then writes to Vercel Blob with `addRandomSuffix: false` and `allowOverwrite: true` so the filename is stable.
4. Pages read snapshots in `getStaticProps` via `getSnapshot({ category })` (e.g. `pages/index.tsx` for the `main` snapshot) and surface staleness through `<StaleIndicator>` UI.

Categories: `main`, `predict`, `agent-economies`, `other`. Plus daily snapshots for `predict-roi-distribution` (per agent) and `predict-tool-accuracy`.

**`MetricWithStatus<T>` shape**: every metric is `{ value, status: { stale, lastValidAt, indexingErrors, fetchErrors, laggingSubgraphs } }`. Use `createStaleStatus`, `getFetchErrorAndCreateStaleStatus`, and `checkSubgraphLag` from `common-util/graphql/metric-utils.ts` to populate it. `CHAIN_CONFIG` in `common-util/constants.ts` defines the per-chain `lagLimit` (calibrated for ~12h indexing tolerance).

**Strapi CMS data flow**:
- `common-util/api/index.ts` and `common-util/useFetchApi.ts` call `${NEXT_PUBLIC_API_URL}/api/<resource>` with `qs`-stringified params.
- `pages/blog/[id].tsx` and `pages/learn/education-articles/[educationArticleId].tsx` use `getServerSideProps` (blog ID can be numeric or slug — see `isIdUsedToFetchBlog`).
- Videos / podcasts use `useFetchVideos` (SWR-backed).

**Regional restrictions** (`middleware.ts`):
- Blocks OFAC-sanctioned countries (CU, IR, KP, SY, RU, BY) and Ukrainian regions (UA-14, UA-09, UA-43, UA-65, UA-23 — Donetsk, Luhansk, Crimea, Sevastopol) using `x-vercel-ip-country` / `x-vercel-ip-country-region` headers.
- Redirects to `/restricted`. `/restricted` and `/disclaimer` are excluded; the matcher also excludes `/api`, `_next/*`, and static assets.

### Vercel Configuration (`vercel.json`)

- **Function limits**: each `refresh-metrics/*.ts` handler is configured with `maxDuration: 300` and `memory: 512`.
- **Crons**:
  - `/api/refresh-metrics/main` — hourly
  - `/api/refresh-metrics/predict` — hourly
  - `/api/refresh-metrics/agent-economies` — every 2 hours
  - `/api/refresh-metrics/other` — every 6 hours
  - `/api/refresh-metrics/predict-roi-distribution?agent=omenstrat` — daily 03:00 UTC
  - `/api/refresh-metrics/predict-roi-distribution?agent=polystrat` — daily 04:00 UTC
  - `/api/refresh-metrics/predict-tool-accuracy` — daily 05:00 UTC

### Environment Variables

All env vars use `NEXT_PUBLIC_` prefix when needed client-side. Categories (see `.env.example`):
- **CMS**: `NEXT_PUBLIC_API_URL` (Strapi)
- **Vercel Blob**: `BLOB_READ_WRITE_TOKEN`
- **Subgraphs** (per chain): `NEXT_PUBLIC_*_STAKING_SUBGRAPH_URL`, `NEXT_PUBLIC_*_REGISTRY_SUBGRAPH_URL`, `NEXT_PUBLIC_TOKENOMICS_*_SUBGRAPH_URL`, `NEXT_PUBLIC_*_MARKETPLACE_SUBGRAPH_URL`, `NEXT_PUBLIC_*_BABYDEGEN_SUBGRAPH_URL`, `NEXT_PUBLIC_*_MECH_FEES_*_SUBGRAPH_URL`, `NEXT_PUBLIC_LIQUIDITY_*_SUBGRAPH_URL`, plus `NEXT_PUBLIC_AUTONOLAS_SUBGRAPH_URL`, `NEXT_PUBLIC_LEGACY_MECH_FEES_GNOSIS_SUBGRAPH_URL`, `NEXT_PUBLIC_OLAS_PREDICT_AGENTS_SUBGRAPH_URL`, `NEXT_PUBLIC_OLAS_POLYMARKET_AGENTS_SUBGRAPH_URL`
- **Balancer**: `NEXT_PUBLIC_GNOSIS_BALANCER_URL`, `NEXT_PUBLIC_POLYGON_BALANCER_URL`
- **RPCs** (server-only, no `NEXT_PUBLIC_`): `ETHEREUM_RPC`, `GNOSIS_RPC`, `ARBITRUM_RPC`, `OPTIMISM_RPC`, `BASE_RPC`, `CELO_RPC`, `POLYGON_RPC`, `MODE_RPC`, `SOLANA_RPC`
- **Other**: `NEXT_PUBLIC_AFMDB_URL`, `NEXT_PUBLIC_QUOTE_TWEET_URL`, irrelevant-tools allow-lists for Omenstrat/Polystrat

### Styling

- Tailwind CSS configured in `tailwind.config.js`; content scanned across `pages/`, `components/`, `common-util/`.
- Custom fonts: **Inter** (body), **Manrope** (heading), **Neue Machina** (`font-machina`).
- Custom colors via CSS variables (HSL) plus brand `valory-green: #00f422`; custom background images (`waves`, `dark-hexagons*`, `governatooorr`, `subtle-gradient`).
- shadcn/ui style components in `components/ui/`; conditional classes via `cn()` from `lib/utils.ts` (`clsx` + `tailwind-merge`).

### Import Aliases

`tsconfig.json` declares paths for `styles/*`, `common-util/*`, `components/*`. ESLint also resolves `data/`, `lib/`, `hooks/`. Always use aliases over relative paths.

ESLint rule (`.eslintrc.json`): **never default- or namespace-import `lodash`** (it bundles the whole library). Use named imports (`import { get } from 'lodash'`) or modular imports (`import get from 'lodash/get'`).

## Important Implementation Details

### GraphQL Queries

Queries live in `common-util/graphql/queries.ts`. When adding a new query:
1. Define the query in `queries.ts`. Always include `_meta { hasIndexingErrors block { number } }` if the metric will be promoted to a snapshot — `mergeWithFallback`/lag detection rely on it.
2. Add or extend a client group in `common-util/graphql/client.ts` if the chain isn't covered.
3. Implement aggregation in `common-util/api/<category>/...` returning `MetricWithStatus<T>` and using `createStaleStatus` / `checkSubgraphLag` / `getFetchErrorAndCreateStaleStatus` helpers.
4. Wire the new metric into the corresponding `fetchAll*` snapshot builder and bump the data type used by `MetricsSnapshot`.

### Adding a New Refresh-Metrics Endpoint

Follow the pattern in `pages/api/refresh-metrics/main.ts`:
1. Guard non-`GET` methods with 405.
2. Call your `fetchAll*` builder; throw if it returns `null`.
3. `saveSnapshot({ category, data })`. Pass `overwrite: true` only when you intend to drop the previous blob (skip the merge).
4. Return `{ success, generatedAt, url, metrics }` on success; 500 with `error.message` on failure.
5. Add the handler to `vercel.json` `functions` (`maxDuration` 300, `memory` 512) and add a `crons` entry.

### Working with Blockchain Data

- Use `BigInt` for large values; never stringify `BigInt` directly — convert with `String(x)` or `x.toString()`.
- Convert wei → ether with `formatWeiNumber()` from `common-util/numberFormatter.ts`; `formatEthNumber()` for already-decimal values.
- Aggregate cross-chain by summing `BigInt`s and formatting once at the end.
- Treat missing/null subgraph data as expected — bubble it up via `MetricWithStatus.status.fetchErrors` rather than failing the whole snapshot.
- When aggregating USD values **across pools/chains with different token decimals** (e.g. USDC=6, WETH=18) — not for single-chain calcs — **sanity-clamp the result before publishing**. A decimals mismatch silently produces huge values rather than errors. Return `null` with a fetchError on breach so `mergeWithFallback` preserves the previous valid snapshot. See `common-util/api/other-metrics/protocol.ts` for the pattern.

### Blob Snapshot Schema Changes

The blob filename is `metrics-${process.env.NODE_ENV}-<schemaVersion>-<category>.json`, where the schema version is resolved **per category** from `SCHEMA_VERSIONS` in `snapshot-storage.ts` (keyed by the category's first path segment, falling back to `DEFAULT_SCHEMA_VERSION`). When making a **breaking** change to a snapshot schema:
1. Bump only the changed category's entry in `SCHEMA_VERSIONS` (e.g. a date suffix) so its new and old blobs don't collide. Do **not** bump globally — that would also reset unrelated categories, including slow-to-rebuild accumulators (`roi-distribution`, `predict-brier`, etc.) that backfill from genesis over many cron runs.
2. Manually trigger the affected `refresh-metrics` endpoints on a Vercel preview to populate the new blobs before merging. For accumulator categories that can't rebuild in one run, copy the old blobs to the new filenames instead (schema permitting).
3. Clean up old blobs from the Vercel Blob dashboard after the rollout.

ISR pages expect the blob shape they were built against — schema drift will surface as render failures, not warnings.

### Content Management

- **Strapi CMS**: blog posts (`pages/blog/[id].tsx`) and education articles (`pages/learn/education-articles/[educationArticleId].tsx`) are fetched via `getServerSideProps` using helpers in `common-util/api/index.ts`.
- **Static data**: agents, chains, kits, resources, etc. live in `data/*.json`.
- **Dynamic agent pages**: `pages/agents/[slug].tsx` uses slugs from `data/agents.json`; `next-sitemap.config.js` adds these to the sitemap. The `/agents` index lives in `pages/agents/index.tsx`, and several agents have dedicated routes (e.g. `babydegen.tsx`, `omenstrat.tsx`, `ai-mechs.tsx`, `agentsfun.tsx`, `contribute.tsx`, `shorts.tsx`) — `next.config.js` redirects legacy slugs (e.g. `/agents/optimus` → `/agents/babydegen`).
- **Kits**: `pages/kits/[id].tsx` (client-side, sourced from `data/kits.json`).
- **Agent economies**: `pages/agent-economies/{index,babydegen,mech,predict,agentsfun}.tsx`.

### Performance Considerations

- Page metrics are read from Vercel Blob during build / ISR rather than queried per request, so subgraph latency rarely affects user-facing pages.
- Images are served via `next/image`; approved remote domains are listed in `next.config.js` (`cms-backend.staging.autonolas.tech`, `cms-backend.autonolas.tech`, `localhost`).
- `outputFileTracingIncludes` in `next.config.js` ensures the OG image route bundles the fonts and images it needs at runtime.
- `optimizePackageImports: ['lodash']` is enabled (alongside the ESLint lodash-import rule).

### Security Headers (`next.config.js`)

Applied to all paths: `Content-Security-Policy: frame-ancestors 'none'`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Strict-Transport-Security: max-age=31536000; includeSubDomains`. Static assets get long-lived cache headers.

`next.config.js` also defines a large set of `redirects()` (e.g. `/protocol` → `/stack`, `/agents/optimus` → `/agents/babydegen`, several `/ea-*` routes → pearl.you). Check there before adding a new redirect.

## Commit & PR Conventions

- Use **conventional commits** for commit messages and **PR titles** (see [conventional commits reference](https://gist.github.com/qoomon/5dfcdf8eec66a051ecd85625518cfd13#types)).
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ops`, `chore`. Use imperative, lowercase, no period at end.
- Branch naming: `feature/<name>`, `fix/<desc>`, `chore/<desc>` (kebab-case). See `CONTRIBUTING.md` for the full flow.

## Common Gotchas

1. **BigInt serialization**: cannot stringify `BigInt` directly — convert to string first.
2. **Subgraph URLs**: must be set in env; production has no fallbacks. A missing URL surfaces as a fetch failure that `mergeWithFallback` will paper over with the last valid snapshot — easy to miss.
3. **Chain coverage varies**: e.g. Babydegen exists only on Optimism + Mode; Balancer only on Gnosis + Polygon; Marketplace omits Celo. Always check the relevant client map.
4. **Blob prefix on schema changes**: forgetting to bump `METRICS_PREFIX` after a breaking change will break ISR (see "Blob Snapshot Schema Changes" above).
5. **Import paths**: always use aliases (`common-util/`, `components/`, `data/`, `hooks/`, `lib/`, `styles/`).
6. **Lodash imports**: default and namespace imports are ESLint-blocked — use `import { x } from 'lodash'` or `import x from 'lodash/x'`.
7. **Middleware runs on the Edge runtime**: keep it lightweight; no Node.js APIs.
8. **TypeScript strictness**: `strict: false` in `tsconfig.json`, `allowJs: true`. New code in `common-util/` should still be typed (per CONTRIBUTING.md).

## Testing Considerations

There is no test runner configured in this repo — verification relies on `yarn lint`, `yarn build`, and manual checks against the dev server. When changing snapshot pipelines:
- Manually hit the `refresh-metrics` endpoint locally (or on a Vercel preview) and inspect the returned JSON.
- Verify graceful degradation: temporarily point a subgraph URL at a bad host and confirm `mergeWithFallback` preserves the previous valid value with `status.stale = true`.
- Spot-check large `BigInt` values for formatting regressions.
- Validate regional restrictions by setting `x-vercel-ip-country` headers in dev.
