# olas-website

Marketing website for [Olas Network](https://olas.network) — autonomous AI agents, staking, and the Olas protocol. Built with **Next.js 14**, a **Strapi** headless CMS, and multi-chain **GraphQL subgraphs** for on-chain metrics.

## Getting started

Use **yarn** (preferred in this repo):

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000). See [contribute.md](contribute.md) for workflow and [CLAUDE.md](CLAUDE.md) for detailed architecture and patterns.

## Architecture (high level)

- **CMS**: [Strapi](https://strapi.io/) backend — blog posts and education articles. Content is fetched at request time for dynamic routes. To change CMS content, use the [CMS backend repo](https://github.com/valory-xyz/cms-backend).
- **Subgraphs**: Metrics (staking, registry, tokenomics, etc.) are read from chain-specific GraphQL subgraphs. API routes under `pages/api/` aggregate data across chains and return JSON; the frontend uses these APIs (and SWR) rather than calling subgraphs directly.
- **Dynamic pages**:
  - **Blog**: `pages/blog/[id].tsx` — post by ID from CMS
  - **Education**: `pages/learn/education-articles/[educationArticleId].tsx` — article by ID from CMS
  - **Agents**: `pages/agents/[slug].tsx` — agent pages by slug (slugs from `data/agents.json`)
  - **Kits**: `pages/kits/[id].tsx` — kit page by ID (client-side)
- **Metrics snapshots**: Precomputed metrics are stored in **Vercel Blob**. Cron jobs (`/api/refresh-metrics/*`) run on a schedule and write updated JSON; pages read from Blob for fast, cached metrics. Prefix is in `common-util/snapshot-storage.ts` — change it when you make breaking schema changes so new blobs are used.

## Commands

| Command       | Description                    |
|---------------|--------------------------------|
| `yarn dev`    | Start dev server               |
| `yarn build`  | Production build (+ sitemap)    |
| `yarn start`  | Run production server          |
| `yarn lint`   | Run ESLint                     |
| `yarn lint:fix` | ESLint with auto-fix         |

## Environment

Copy `.env.example` to `.env` and fill in values. Key groups: `NEXT_PUBLIC_API_URL` (Strapi), `BLOB_READ_WRITE_TOKEN` (Vercel Blob), and the various `NEXT_PUBLIC_*_SUBGRAPH_URL` / RPC URLs for each chain.

## Deploy (Vercel)

### Functions

The `functions` block in `vercel.json` configures resource limits for serverless API routes:

```json
"functions": {
  "pages/api/refresh-metrics/main.ts": {
    "maxDuration": 300,
    "memory": 512
  }
}
```

| Property | Description |
|----------|-------------|
| `maxDuration` | Maximum execution time in seconds |
| `memory` | Memory allocation in MB |

### Vercel Blobs (Metrics Storage)

Metrics are stored in [Vercel Blob Storage](https://vercel.com/docs/storage/vercel-blob) to persist data between cron job runs and ISR (Incremental Static Regeneration) page rebuilds.

The blob filename prefix is defined in `common-util/snapshot-storage.ts`:

```typescript
const METRICS_PREFIX = `metrics-${process.env.NODE_ENV}`;
```

### Crons

The `crons` block schedules automatic API calls. Cron syntax: `minute hour day-of-month month day-of-week`

| Schedule | Meaning | Example Use |
|----------|---------|-------------|
| `0 * * * *` | Every hour at minute 0 | Main metrics, Predict metrics |
| `0 */2 * * *` | Every 2 hours at minute 0 | Agent economies |
| `0 */6 * * *` | Every 6 hours at minute 0 | Other metrics |

Current schedules in `vercel.json`:
- `/api/refresh-metrics/main` — hourly
- `/api/refresh-metrics/predict` — hourly
- `/api/refresh-metrics/agent-economies` — every 2 hours
- `/api/refresh-metrics/other` — every 6 hours

### Breaking Changes

> **⚠️ Important:** When making breaking changes to the metrics schema (adding/removing/renaming fields), you **must update the blob prefix** to create a new version of the blobs.

During ISR, Next.js expects the stored blob schema to match what the page components expect. If you change the schema without updating the prefix, ISR pages may fail to render due to schema mismatches.

**To introduce a new blob version:**

1. Update the prefix in `common-util/snapshot-storage.ts` (e.g., `metrics-2025-01-30-${process.env.NODE_ENV}`)
2. On Vercel preview builds, manually trigger the refresh-metrics endpoints. This will populate the new blobs.
3. Once the build is live, old blobs can be cleaned up from the Vercel Blob dashboard

The blob filename prefix is defined in `common-util/snapshot-storage.ts`:

```typescript
const METRICS_PREFIX = `metrics-${process.env.NODE_ENV}`;
```

## Contributing

We use **conventional commits** for both commit messages and **PR titles** (e.g. `feat: add X`, `fix: resolve Y`). See [contribute.md](contribute.md) and the [conventional commits reference](https://gist.github.com/qoomon/5dfcdf8eec66a051ecd85625518cfd13#types).
