import { GraphQLClient } from 'graphql-request';

import {
  BABYDEGEN_SUBGRAPH_URLS,
  BALANCER_SUBGRAPH_URLS,
  LIQUIDITY_SQUID_URLS,
  LIQUIDITY_SUBGRAPH_URLS,
  MARKETPLACE_SQUID_URLS,
  MARKETPLACE_SUBGRAPH_URLS,
  MECH_FEES_SQUID_URLS,
  MECH_FEES_SUBGRAPH_URLS,
  REGISTRY_SQUID_URLS,
  REGISTRY_SUBGRAPH_URLS,
  STAKING_SUBGRAPH_URLS,
  TOKENOMICS_SUBGRAPH_URLS,
} from 'common-util/indexers';

const requestConfig = {
  jsonSerializer: {
    parse: JSON.parse,
    stringify: JSON.stringify,
  },
};

// One client per chain of a `common-util/indexers` map, so clients, chain keys and
// /data links can't disagree about which chains a source covers.
const toClients = <K extends string>(urls: Record<K, string | undefined>) =>
  Object.fromEntries(
    Object.entries(urls).map(([chain, url]) => [
      chain,
      new GraphQLClient(url as string, requestConfig),
    ])
  ) as Record<K, GraphQLClient>;

// *_GRAPH_CLIENTS are The Graph subgraphs; *_SQUID_CLIENTS are SQD squids (OpenReader
// dialect). Where a source has both, read it through `common-util/graphql/indexer-requests.ts`.

export const TOKENOMICS_GRAPH_CLIENTS = toClients(TOKENOMICS_SUBGRAPH_URLS);

export const STAKING_GRAPH_CLIENTS = toClients(STAKING_SUBGRAPH_URLS);

export const REGISTRY_GRAPH_CLIENTS = toClients(REGISTRY_SUBGRAPH_URLS);
export const REGISTRY_SQUID_CLIENTS = toClients(REGISTRY_SQUID_URLS);

export const MARKETPLACE_GRAPH_CLIENTS = toClients(MARKETPLACE_SUBGRAPH_URLS);
export const MARKETPLACE_SQUID_CLIENTS = toClients(MARKETPLACE_SQUID_URLS);

export const MECH_FEES_GRAPH_CLIENTS = toClients(MECH_FEES_SUBGRAPH_URLS);
export const MECH_FEES_SQUID_CLIENTS = toClients(MECH_FEES_SQUID_URLS);

export const LIQUIDITY_GRAPH_CLIENTS = toClients(LIQUIDITY_SUBGRAPH_URLS);
// Swap fees only — POL valuation stays on-chain (docs/pol-live-reserves.md).
export const LIQUIDITY_SQUID_CLIENTS = toClients(LIQUIDITY_SQUID_URLS);

export const BABYDEGEN_GRAPH_CLIENTS = toClients(BABYDEGEN_SUBGRAPH_URLS);

export const BALANCER_GRAPH_CLIENTS = toClients(BALANCER_SUBGRAPH_URLS);

export const predictAgentsGraphClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_OLAS_PREDICT_AGENTS_SUBGRAPH_URL,
  requestConfig
);

// SQD squid, not a subgraph — queries use the OpenReader dialect.
export const polymarketAgentsGraphClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_OLAS_POLYMARKET_AGENTS_SQUID_URL,
  requestConfig
);

export const legacyMechFeesGraphClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_LEGACY_MECH_FEES_GNOSIS_SUBGRAPH_URL,
  requestConfig
);

export const autonolasGraphClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_AUTONOLAS_SUBGRAPH_URL,
  requestConfig
);
