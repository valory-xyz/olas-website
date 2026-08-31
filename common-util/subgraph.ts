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
