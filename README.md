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

- **Functions**: `vercel.json` sets resource limits for `pages/api/refresh-metrics/*`.
- **Crons**: Refresh jobs run on a schedule (e.g. main/predict hourly; agent-economies every 2h; other every 6h).

When you change the metrics schema, update the blob prefix in `common-util/snapshot-storage.ts` so new blobs are written; then trigger the refresh endpoints or wait for cron.

## Contributing

We use **conventional commits** for both commit messages and **PR titles** (e.g. `feat: add X`, `fix: resolve Y`). See [contribute.md](contribute.md) and the [conventional commits reference](https://gist.github.com/qoomon/5dfcdf8eec66a051ecd85625518cfd13#types).
