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

/**
 * Mech-fee subgraph endpoints by chain, in the order `MECH_FEES_CHAIN_KEYS` lists them.
 *
 * Here rather than in `graphql/client.ts` so the data-verification page can name every
 * source without pulling GraphQL clients into the browser bundle — the same reason the
 * chain-key lists live in `constants.ts`. `client.ts` builds its clients from the same
 * env vars; the dev-only guard there catches a chain added to one and not the other.
 *
 * Next.js inlines `process.env.NEXT_PUBLIC_*` at build time only for statically written
 * references, so each one is spelled out rather than composed from the chain name.
 */
export const MECH_FEES_SUBGRAPH_URLS: Record<string, string | undefined> = {
  ethereum: process.env.NEXT_PUBLIC_MECH_FEES_ETHEREUM_SUBGRAPH_URL,
  gnosis: process.env.NEXT_PUBLIC_NEW_MECH_FEES_GNOSIS_SUBGRAPH_URL,
  arbitrum: process.env.NEXT_PUBLIC_MECH_FEES_ARBITRUM_SUBGRAPH_URL,
  optimism: process.env.NEXT_PUBLIC_MECH_FEES_OPTIMISM_SUBGRAPH_URL,
  base: process.env.NEXT_PUBLIC_NEW_MECH_FEES_BASE_SUBGRAPH_URL,
  celo: process.env.NEXT_PUBLIC_MECH_FEES_CELO_SUBGRAPH_URL,
  polygon: process.env.NEXT_PUBLIC_MECH_FEES_POLYGON_SUBGRAPH_URL,
};
