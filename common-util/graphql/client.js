import { GraphQLClient } from 'graphql-request';

const requestConfig = {
  jsonSerializer: {
    parse: JSON.parse,
    stringify: JSON.stringify,
  },
};

const createClient = (url) =>
  url ? new GraphQLClient(url, requestConfig) : null;

export const TOKENOMICS_GRAPH_CLIENTS = {
  ethereum: createClient(
    process.env.NEXT_PUBLIC_TOKENOMICS_ETHEREUM_SUBGRAPH_URL,
  ),
  arbitrum: createClient(
    process.env.NEXT_PUBLIC_TOKENOMICS_ARBITRUM_SUBGRAPH_URL,
  ),
  base: createClient(process.env.NEXT_PUBLIC_TOKENOMICS_BASE_SUBGRAPH_URL),
  celo: createClient(process.env.NEXT_PUBLIC_TOKENOMICS_CELO_SUBGRAPH_URL),
  gnosis: createClient(process.env.NEXT_PUBLIC_TOKENOMICS_GNOSIS_SUBGRAPH_URL),
  optimism: createClient(
    process.env.NEXT_PUBLIC_TOKENOMICS_OPTIMISM_SUBGRAPH_URL,
  ),
  polygon: createClient(
    process.env.NEXT_PUBLIC_TOKENOMICS_POLYGON_SUBGRAPH_URL,
  ),
};

export const STAKING_GRAPH_CLIENTS = {
  mode: new GraphQLClient(
    process.env.NEXT_PUBLIC_MODE_STAKING_SUBGRAPH_URL,
    requestConfig,
  ),
  optimism: new GraphQLClient(
    process.env.NEXT_PUBLIC_OPTIMISM_STAKING_SUBGRAPH_URL,
    requestConfig,
  ),
  gnosis: new GraphQLClient(
    process.env.NEXT_PUBLIC_GNOSIS_STAKING_SUBGRAPH_URL,
    requestConfig,
  ),
  base: new GraphQLClient(
    process.env.NEXT_PUBLIC_BASE_STAKING_SUBGRAPH_URL,
    requestConfig,
  ),
};

export const REGISTRY_GRAPH_CLIENTS = {
  mode: new GraphQLClient(
    process.env.NEXT_PUBLIC_MODE_REGISTRY_SUBGRAPH_URL,
    requestConfig,
  ),
  optimism: new GraphQLClient(
    process.env.NEXT_PUBLIC_OPTIMISM_REGISTRY_SUBGRAPH_URL,
    requestConfig,
  ),
  gnosis: new GraphQLClient(
    process.env.NEXT_PUBLIC_GNOSIS_REGISTRY_SUBGRAPH_URL,
    requestConfig,
  ),
  base: new GraphQLClient(
    process.env.NEXT_PUBLIC_BASE_REGISTRY_SUBGRAPH_URL,
    requestConfig,
  ),
  celo: new GraphQLClient(
    process.env.NEXT_PUBLIC_CELO_REGISTRY_SUBGRAPH_URL,
    requestConfig,
  ),
  ethereum: new GraphQLClient(
    process.env.NEXT_PUBLIC_ETHEREUM_REGISTRY_SUBGRAPH_URL,
    requestConfig,
  ),
  arbitrum: new GraphQLClient(
    process.env.NEXT_PUBLIC_ARBITRUM_REGISTRY_SUBGRAPH_URL,
    requestConfig,
  ),
  polygon: new GraphQLClient(
    process.env.NEXT_PUBLIC_POLYGON_REGISTRY_SUBGRAPH_URL,
    requestConfig,
  ),
};

export const mechGraphClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_OLAS_MECH_SUBGRAPH_URL,
  requestConfig,
);

export const predictAgentsGraphClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_OLAS_PREDICT_AGENTS_SUBGRAPH_URL,
  requestConfig,
);

export const ATA_GRAPH_CLIENTS = {
  gnosis: new GraphQLClient(
    process.env.NEXT_PUBLIC_GNOSIS_MM_SUBGRAPH_URL,
    requestConfig,
  ),
  base: new GraphQLClient(
    process.env.NEXT_PUBLIC_BASE_MM_SUBGRAPH_URL,
    requestConfig,
  ),
  legacyMech: new GraphQLClient(
    process.env.NEXT_PUBLIC_GNOSIS_LM_SUBGRAPH_URL,
    requestConfig,
  ),
};

export const MECH_FEES_GRAPH_CLIENTS = {
  gnosis: new GraphQLClient(
    process.env.NEXT_PUBLIC_NEW_MECH_FEES_GNOSIS_SUBGRAPH_URL,
    requestConfig,
  ),
  base: new GraphQLClient(
    process.env.NEXT_PUBLIC_NEW_MECH_FEES_BASE_SUBGRAPH_URL,
    requestConfig,
  ),
};

export const legacyMechFeesGraphClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_LEGACY_MECH_FEES_GNOSIS_SUBGRAPH_URL,
  requestConfig,
);
