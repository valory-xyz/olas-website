/**
 * Converts a subgraph API URL to a Graph Explorer URL for user-facing links.
 */
export function getSubgraphExplorerUrl(apiUrl) {
  if (!apiUrl) return '';

  // Extract deployment ID from gateway URLs
  const gatewayMatch = apiUrl.match(/subgraphs\/id\/([A-Za-z0-9]+)/);
  if (gatewayMatch) {
    return `https://thegraph.com/explorer/subgraphs/${gatewayMatch[1]}?view=Query&chain=arbitrum-one`;
  }

  return apiUrl;
}
