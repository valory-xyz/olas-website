# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Olas Network marketing website - a Next.js 14 application that showcases autonomous AI agents, staking programs, and the Olas protocol. The site uses Strapi as a headless CMS backend and integrates with multiple blockchain networks through GraphQL subgraphs.

## Development Commands

```bash
# Development
npm run dev          # Start dev server at http://localhost:3000

# Building
npm run build        # Build for production
npm run postbuild    # Generates sitemap (runs automatically after build)

# Production
npm start           # Start production server

# Linting
npm run lint        # Run ESLint
npm run lint:fix    # Fix ESLint issues automatically
```

## Architecture

### Directory Structure

- `pages/` - Next.js pages using file-based routing
  - `pages/api/` - API routes for fetching metrics from subgraphs and external APIs
  - Dynamic routes use bracket notation: `[slug].jsx`, `[id].jsx`
- `components/` - React components organized by page (e.g., `BuildPage/`, `AUPage/`)
  - `components/ui/` - Reusable UI components (using Radix UI and shadcn/ui patterns)
  - `components/Layout/` - Layout components (Header, Footer, Menu)
- `common-util/` - Shared utilities and business logic
  - `common-util/api/` - API client functions
  - `common-util/graphql/` - GraphQL clients and queries for blockchain subgraphs
  - Contains utility functions for formatting, calculations, Web3, etc.
- `data/` - Static JSON data files for agents, chains, metrics caches, etc.
- `styles/` - Global CSS and Tailwind styles
- `hooks/` - Custom React hooks
- `public/` - Static assets (images, documents, fonts)

### Key Technical Patterns

**Multi-Chain GraphQL Architecture:**
- The site queries data from multiple blockchain networks (Ethereum, Gnosis, Base, Optimism, Mode, Celo, Arbitrum, Polygon)
- Each chain has dedicated GraphQL clients defined in `common-util/graphql/client.js`
- Clients are organized by category: `TOKENOMICS_GRAPH_CLIENTS`, `STAKING_GRAPH_CLIENTS`, `REGISTRY_GRAPH_CLIENTS`, etc.
- API routes aggregate data across chains using `Promise.allSettled()` for fault tolerance

**Metrics Fetching Pattern:**
- API routes (e.g., `pages/api/main-metrics.js`) fetch and aggregate metrics from multiple subgraphs
- Results are cached at the CDN level with 12-hour expiration (`CACHE_DURATION_SECONDS`)
- Frontend components use `useFetchApi` hook or SWR for data fetching
- Failed subgraph queries don't break the entire page - graceful degradation is built-in

**Regional Restrictions:**
- `middleware.js` blocks OFAC sanctioned countries and regions using Vercel's geo-headers
- Blocked countries: Cuba (CU), Iran (IR), North Korea (KP), Syria (SY), Russia (RU), Belarus (BY)
- Blocked Ukrainian regions: UA-14, UA-09, UA-43, UA-65, UA-23 (Donetsk, Luhansk, Crimea, Sevastopol)
- Redirects to `/restricted` page for blocked locations

**Data Flow:**
1. Frontend components call API routes via `/api/*` endpoints
2. API routes use GraphQL clients to query The Graph subgraphs
3. Data is aggregated across multiple chains
4. Results are formatted using utilities from `common-util/`
5. CDN caching reduces load on subgraphs

### Environment Variables

All environment variables use `NEXT_PUBLIC_` prefix for client-side access. Key categories:

- **CMS**: `NEXT_PUBLIC_API_URL` for Strapi backend
- **Analytics**: `NEXT_PUBLIC_DUNE_API_KEY`, `NEXT_PUBLIC_STREAM_ID`
- **Subgraphs**: Multiple URLs for different chains and contracts
  - Staking: `NEXT_PUBLIC_*_STAKING_SUBGRAPH_URL`
  - Registry: `NEXT_PUBLIC_*_REGISTRY_SUBGRAPH_URL`
  - Tokenomics: `NEXT_PUBLIC_TOKENOMICS_*_SUBGRAPH_URL`
  - Special: Mech, Predict, Babydegen subgraphs

See `.env.example` for the complete list.

### Styling

- Tailwind CSS with custom theme configuration in `tailwind.config.js`
- Custom fonts: Inter (body), Manrope (headings), Neue Machina
- Custom background patterns and color system
- Uses shadcn/ui components with Radix UI primitives
- Class utilities: `cn()` for conditional classes via `clsx` and `tailwind-merge`

### Import Aliases

Configured in `jsconfig.json` and ESLint:
- `common-util/*` → `/common-util/*`
- `components/*` → `/components/*`
- `data/*` → `/data/*`
- `styles/*` → `/styles/*`
- `lib/*` → `/lib/*`
- `hooks/*` → `/hooks/*`

## Important Implementation Details

### GraphQL Queries

All GraphQL queries are centralized in `common-util/graphql/queries.js`. When adding new queries:
1. Define the query in `queries.js`
2. Add appropriate client to `client.js` if needed
3. Create wrapper function in `common-util/api/` for business logic
4. Expose via API route in `pages/api/`

### Adding New API Routes

Follow the pattern in `pages/api/main-metrics.js`:
1. Import GraphQL clients and queries
2. Implement data fetching with `Promise.allSettled()` for fault tolerance
3. Add CDN cache headers using `CACHE_DURATION_SECONDS`
4. Return structured JSON with error handling
5. Use `formatWeiNumber()` or `formatEthNumber()` from `common-util/numberFormatter.js` for blockchain values

### Working with Blockchain Data

- Use BigInt for large numbers to avoid precision loss
- Convert Wei to Ether: divide by `10**18` or use `formatWeiNumber()`
- Aggregate cross-chain data by summing BigInt values, then format
- Handle missing/null data gracefully - subgraphs may be temporarily unavailable

### Content Management

- Blog posts and educational articles are fetched from Strapi CMS
- Static content (agents, chains, resources) is stored in `data/*.json`
- Dynamic agent pages use `pages/agents/[slug].jsx` pattern
- Sitemap generation includes dynamic routes via `next-sitemap.config.js`

### Performance Considerations

- API routes are heavily cached at CDN (12 hours)
- Images are optimized via Next.js Image component with approved domains in `next.config.js`
- Static generation where possible, ISR for dynamic content
- Parallel subgraph queries to minimize latency

### Security Headers

Configured in `next.config.js`:
- CSP: `frame-ancestors 'none'` to prevent clickjacking
- HSTS enabled with includeSubDomains
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

## Common Gotchas

1. **BigInt Serialization**: Cannot stringify BigInt directly - convert to string first
2. **Subgraph URLs**: Must be configured in environment variables; no fallbacks in production
3. **Chain-specific Logic**: Some metrics (like Babydegen) only exist on specific chains (Optimism, Mode)
4. **Cache Invalidation**: CDN cache is 12 hours; test with cache-busting query params in dev
5. **Import Paths**: Always use aliases (`common-util/`, `components/`) not relative paths
6. **Middleware Runs on Edge**: Keep middleware lightweight; no Node.js APIs available

## Testing Considerations

- Test multi-chain aggregation by mocking individual subgraph responses
- Verify graceful degradation when subgraphs are unavailable
- Check number formatting for very large Wei values
- Validate regional restrictions using different IP headers
- Test API caching behavior with different cache headers
