/**
 * Converts a subgraph API URL to a Graph Explorer URL for user-facing links.
 *
 * Returns `null` when the endpoint has no browsable page. The Graph's gateway
 * URLs have an Explorer entry, but self-hosted graph-node endpoints (the
 * `*.subgraph.autonolas.tech` hosts) are POST-only GraphQL APIs: a GET returns
 * 405 and there is no playground to land on. Linking those hands readers — and
 * crawlers — a guaranteed error page, so callers should render them as plain
 * text instead. Use `SubgraphLink`, which makes that choice for you.
 */
export function getSubgraphExplorerUrl(apiUrl?: string): string | null {
  if (!apiUrl) return null;

  // Extract deployment ID from gateway URLs
  const gatewayMatch = apiUrl.match(/subgraphs\/id\/([A-Za-z0-9]+)/);
  if (gatewayMatch) {
    return `https://thegraph.com/explorer/subgraphs/${gatewayMatch[1]}?view=Query&chain=arbitrum-one`;
  }

  return null;
}
