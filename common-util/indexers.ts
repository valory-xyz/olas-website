/**
 * Every per-chain indexer endpoint, in one place and one shape: `{ chain: url }`, split into
 * The Graph subgraphs and SQD squids (OpenReader dialect). The split decides the query
 * dialect — see `common-util/graphql/indexers.ts`.
 *
 * Single source for three consumers: `graphql/client.ts` builds its clients from these maps,
 * the chain keys and scope sentences are read off them, and the `/data` page links them
 * (`getSubgraphExplorerUrl` below turns an endpoint into a page a reader can open). No
 * GraphQL imports here, so components can use it without pulling clients into the bundle.
 *
 * Next.js inlines `process.env.NEXT_PUBLIC_*` at build time only for statically written
 * references, so each one is spelled out rather than composed from the chain name. Key order
 * is display order.
 */

export type IndexerUrls = Record<string, string | undefined>;

export const TOKENOMICS_SUBGRAPH_URLS = {
  ethereum: process.env.NEXT_PUBLIC_TOKENOMICS_ETHEREUM_SUBGRAPH_URL,
  arbitrum: process.env.NEXT_PUBLIC_TOKENOMICS_ARBITRUM_SUBGRAPH_URL,
  base: process.env.NEXT_PUBLIC_TOKENOMICS_BASE_SUBGRAPH_URL,
  celo: process.env.NEXT_PUBLIC_TOKENOMICS_CELO_SUBGRAPH_URL,
  gnosis: process.env.NEXT_PUBLIC_TOKENOMICS_GNOSIS_SUBGRAPH_URL,
  optimism: process.env.NEXT_PUBLIC_TOKENOMICS_OPTIMISM_SUBGRAPH_URL,
  polygon: process.env.NEXT_PUBLIC_TOKENOMICS_POLYGON_SUBGRAPH_URL,
  mode: process.env.NEXT_PUBLIC_TOKENOMICS_MODE_SUBGRAPH_URL,
} satisfies IndexerUrls;

// Ethereum, Arbitrum and Celo staking subgraphs exist but are not queried.
export const STAKING_SUBGRAPH_URLS = {
  gnosis: process.env.NEXT_PUBLIC_GNOSIS_STAKING_SUBGRAPH_URL,
  optimism: process.env.NEXT_PUBLIC_OPTIMISM_STAKING_SUBGRAPH_URL,
  base: process.env.NEXT_PUBLIC_BASE_STAKING_SUBGRAPH_URL,
  mode: process.env.NEXT_PUBLIC_MODE_STAKING_SUBGRAPH_URL,
  polygon: process.env.NEXT_PUBLIC_POLYGON_STAKING_SUBGRAPH_URL,
} satisfies IndexerUrls;

export const REGISTRY_SUBGRAPH_URLS = {
  ethereum: process.env.NEXT_PUBLIC_ETHEREUM_REGISTRY_SUBGRAPH_URL,
  gnosis: process.env.NEXT_PUBLIC_GNOSIS_REGISTRY_SUBGRAPH_URL,
  base: process.env.NEXT_PUBLIC_BASE_REGISTRY_SUBGRAPH_URL,
  mode: process.env.NEXT_PUBLIC_MODE_REGISTRY_SUBGRAPH_URL,
  optimism: process.env.NEXT_PUBLIC_OPTIMISM_REGISTRY_SUBGRAPH_URL,
  celo: process.env.NEXT_PUBLIC_CELO_REGISTRY_SUBGRAPH_URL,
  arbitrum: process.env.NEXT_PUBLIC_ARBITRUM_REGISTRY_SUBGRAPH_URL,
  polygon: process.env.NEXT_PUBLIC_POLYGON_REGISTRY_SUBGRAPH_URL,
} satisfies IndexerUrls;

export const REGISTRY_SQUID_URLS = {
  robinhood: process.env.NEXT_PUBLIC_REGISTRY_ROBINHOOD_SQUID_URL,
} satisfies IndexerUrls;

// Celo has a marketplace subgraph, but it is not queried.
export const MARKETPLACE_SUBGRAPH_URLS = {
  ethereum: process.env.NEXT_PUBLIC_ETHEREUM_MARKETPLACE_SUBGRAPH_URL,
  gnosis: process.env.NEXT_PUBLIC_GNOSIS_MARKETPLACE_SUBGRAPH_URL,
  arbitrum: process.env.NEXT_PUBLIC_ARBITRUM_MARKETPLACE_SUBGRAPH_URL,
  optimism: process.env.NEXT_PUBLIC_OPTIMISM_MARKETPLACE_SUBGRAPH_URL,
  base: process.env.NEXT_PUBLIC_BASE_MARKETPLACE_SUBGRAPH_URL,
  polygon: process.env.NEXT_PUBLIC_POLYGON_MARKETPLACE_SUBGRAPH_URL,
} satisfies IndexerUrls;

export const MARKETPLACE_SQUID_URLS = {
  robinhood: process.env.NEXT_PUBLIC_MARKETPLACE_ROBINHOOD_SQUID_URL,
} satisfies IndexerUrls;

export const MECH_FEES_SUBGRAPH_URLS = {
  ethereum: process.env.NEXT_PUBLIC_MECH_FEES_ETHEREUM_SUBGRAPH_URL,
  gnosis: process.env.NEXT_PUBLIC_NEW_MECH_FEES_GNOSIS_SUBGRAPH_URL,
  arbitrum: process.env.NEXT_PUBLIC_MECH_FEES_ARBITRUM_SUBGRAPH_URL,
  optimism: process.env.NEXT_PUBLIC_MECH_FEES_OPTIMISM_SUBGRAPH_URL,
  base: process.env.NEXT_PUBLIC_NEW_MECH_FEES_BASE_SUBGRAPH_URL,
  celo: process.env.NEXT_PUBLIC_MECH_FEES_CELO_SUBGRAPH_URL,
  polygon: process.env.NEXT_PUBLIC_MECH_FEES_POLYGON_SUBGRAPH_URL,
} satisfies IndexerUrls;

export const MECH_FEES_SQUID_URLS = {
  robinhood: process.env.NEXT_PUBLIC_MECH_FEES_ROBINHOOD_SQUID_URL,
} satisfies IndexerUrls;

export const LIQUIDITY_SUBGRAPH_URLS = {
  ethereum: process.env.NEXT_PUBLIC_LIQUIDITY_ETHEREUM_SUBGRAPH_URL,
  gnosis: process.env.NEXT_PUBLIC_LIQUIDITY_GNOSIS_SUBGRAPH_URL,
  polygon: process.env.NEXT_PUBLIC_LIQUIDITY_POLYGON_SUBGRAPH_URL,
  arbitrum: process.env.NEXT_PUBLIC_LIQUIDITY_ARBITRUM_SUBGRAPH_URL,
  optimism: process.env.NEXT_PUBLIC_LIQUIDITY_OPTIMISM_SUBGRAPH_URL,
  base: process.env.NEXT_PUBLIC_LIQUIDITY_BASE_SUBGRAPH_URL,
  celo: process.env.NEXT_PUBLIC_LIQUIDITY_CELO_SUBGRAPH_URL,
} satisfies IndexerUrls;

// Swap fees only — POL valuation reads reserves on-chain (docs/pol-live-reserves.md).
export const LIQUIDITY_SQUID_URLS = {
  robinhood: process.env.NEXT_PUBLIC_LIQUIDITY_ROBINHOOD_SQUID_URL,
} satisfies IndexerUrls;

export const BABYDEGEN_SUBGRAPH_URLS = {
  optimism: process.env.NEXT_PUBLIC_OPTIMISM_BABYDEGEN_SUBGRAPH_URL,
  mode: process.env.NEXT_PUBLIC_MODE_BABYDEGEN_SUBGRAPH_URL,
  base: process.env.NEXT_PUBLIC_BASE_BABYDEGEN_SUBGRAPH_URL,
} satisfies IndexerUrls;

export const BALANCER_SUBGRAPH_URLS = {
  gnosis: process.env.NEXT_PUBLIC_GNOSIS_BALANCER_URL,
  polygon: process.env.NEXT_PUBLIC_POLYGON_BALANCER_URL,
} satisfies IndexerUrls;

// Chains each source covers — the published scope of its metrics. Subgraph chains first.
// Read off the URL maps, never derived from `CHAIN_LAG_CONFIG` (that is the RPC table).
export const MARKETPLACE_CHAIN_KEYS = [
  ...Object.keys(MARKETPLACE_SUBGRAPH_URLS),
  ...Object.keys(MARKETPLACE_SQUID_URLS),
];
export const MECH_FEES_CHAIN_KEYS = [
  ...Object.keys(MECH_FEES_SUBGRAPH_URLS),
  ...Object.keys(MECH_FEES_SQUID_URLS),
];

/**
 * "all N chains … (A, B and C)" for a set of chain keys.
 *
 * Count first so it reads as a complete set, then the names so a reader can verify it.
 * Both derived, so neither can drift from the aggregation being described — the same
 * sentence was hand-written in four places before this.
 */
const chainScope = (keys: string[], what: string) => {
  const names = keys.map((k) => k.charAt(0).toUpperCase() + k.slice(1));
  const list = `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
  return `all ${names.length} chains ${what} (${list})`;
};

export const MARKETPLACE_CHAIN_SCOPE = chainScope(
  MARKETPLACE_CHAIN_KEYS,
  'the Mech Marketplace is deployed on'
);

export const MECH_FEES_CHAIN_SCOPE = chainScope(
  MECH_FEES_CHAIN_KEYS,
  'the mech-fee subgraphs and squids cover'
);

/**
 * Maps a subgraph API URL to a page a reader can actually open, or `null` when
 * the endpoint has no such page.
 *
 * Three URL shapes reach this helper:
 *
 * - **The Graph gateway** (`.../subgraphs/id/<id>`) — has an Explorer entry.
 * - **Our proxy** (`api.subgraph[.staging].autonolas.tech/api/proxy/<name>`) —
 *   answers GET with a 307 to a GraphiQL playground, so it is browsable as-is.
 * - **Legacy direct hosts** (`<name>.subgraph.autonolas.tech`) — POST-only.
 *   A GET returns `405 Allow: POST` with an empty body and there is no
 *   playground at any path, so there is nothing to link to.
 *
 * Callers should render the last case as plain text rather than as a link that
 * is guaranteed to fail. `SubgraphLink` does that, and still shows the endpoint
 * so a reader can POST their own query to it.
 */
export function getSubgraphExplorerUrl(apiUrl?: string): string | null {
  if (!apiUrl) return null;

  // Extract deployment ID from gateway URLs
  const gatewayMatch = apiUrl.match(/subgraphs\/id\/([A-Za-z0-9]+)/);
  if (gatewayMatch) {
    return `https://thegraph.com/explorer/subgraphs/${gatewayMatch[1]}?view=Query&chain=arbitrum-one`;
  }

  // The proxy redirects GET to a playground, so it opens fine in a browser.
  if (/^https:\/\/api\.subgraph\.(staging\.)?autonolas\.tech\/api\/proxy\//.test(apiUrl)) {
    return apiUrl;
  }

  return null;
}
