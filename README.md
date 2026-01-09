
# olas-website

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Vercel Configuration (`vercel.json`)

The `vercel.json` file configures serverless functions and scheduled cron jobs for refreshing metrics.

### Functions

The `functions` block configures resource limits for serverless API routes:

```json
"functions": {
  "pages/api/refresh-metrics/main.ts": {
    "maxDuration": 300,
    "memory": 3009
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

#### Breaking Changes

> **⚠️ Important:** When making breaking changes to the metrics schema (adding/removing/renaming fields), you **must update the blob prefix** to create a new version of the blobs.

During ISR, Next.js expects the stored blob schema to match what the page components expect. If you change the schema without updating the prefix, ISR pages may fail to render due to schema mismatches.

**To introduce a new blob version:**

1. Update the prefix in `snapshot-storage.ts` (e.g., `metrics-v2-${process.env.NODE_ENV}`)
2. On Vercel preview builds, manually trigger the refresh-metrics endpoints. This will populate the new blobs.
3. Once the build is live, old blobs can be cleaned up from the Vercel Blob dashboard

### Crons

The `crons` block schedules automatic API calls as per following syntax:

```json
"crons": [
  {
    "path": "/api/refresh-metrics/main",
    "schedule": "0 * * * *"
  }
]
```

**Cron syntax:** `minute hour day-of-month month day-of-week`

| Schedule | Meaning | Example Use |
|----------|---------|-------------|
| `0 * * * *` | Every hour at minute 0 | Main metrics, Predict metrics |
| `0 */2 * * *` | Every 2 hours at minute 0 | Agent economies |
| `0 */6 * * *` | Every 6 hours at minute 0 | Other metrics |

## Update CMS

This site uses [Strapi](https://strapi.io/) as a CMS. To update the content, run the [CMS backend repo](https://github.com/valory-xyz/cms-backend).

