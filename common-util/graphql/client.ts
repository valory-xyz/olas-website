import { GraphQLClient } from 'graphql-request';

const requestConfig = {
  jsonSerializer: {
    parse: JSON.parse,
    stringify: JSON.stringify,
  },
};

export const TOKENOMICS_GRAPH_CLIENTS = {
  ethereum: new GraphQLClient(
    process.env.NEXT_PUBLIC_TOKENOMICS_ETHEREUM_SUBGRAPH_URL,
    requestConfig
  ),
  arbitrum: new GraphQLClient(
    process.env.NEXT_PUBLIC_TOKENOMICS_ARBITRUM_SUBGRAPH_URL,
    requestConfig
  ),
  base: new GraphQLClient(process.env.NEXT_PUBLIC_TOKENOMICS_BASE_SUBGRAPH_URL, requestConfig),
  celo: new GraphQLClient(process.env.NEXT_PUBLIC_TOKENOMICS_CELO_SUBGRAPH_URL, requestConfig),
  gnosis: new GraphQLClient(process.env.NEXT_PUBLIC_TOKENOMICS_GNOSIS_SUBGRAPH_URL, requestConfig),
  optimism: new GraphQLClient(
    process.env.NEXT_PUBLIC_TOKENOMICS_OPTIMISM_SUBGRAPH_URL,
    requestConfig
  ),
  polygon: new GraphQLClient(
    process.env.NEXT_PUBLIC_TOKENOMICS_POLYGON_SUBGRAPH_URL,
    requestConfig
  ),
  mode: new GraphQLClient(process.env.NEXT_PUBLIC_TOKENOMICS_MODE_SUBGRAPH_URL, requestConfig),
};

export const STAKING_GRAPH_CLIENTS = {
  mode: new GraphQLClient(process.env.NEXT_PUBLIC_MODE_STAKING_SUBGRAPH_URL, requestConfig),
  optimism: new GraphQLClient(process.env.NEXT_PUBLIC_OPTIMISM_STAKING_SUBGRAPH_URL, requestConfig),
  gnosis: new GraphQLClient(process.env.NEXT_PUBLIC_GNOSIS_STAKING_SUBGRAPH_URL, requestConfig),
  base: new GraphQLClient(process.env.NEXT_PUBLIC_BASE_STAKING_SUBGRAPH_URL, requestConfig),
  polygon: new GraphQLClient(process.env.NEXT_PUBLIC_POLYGON_STAKING_SUBGRAPH_URL, requestConfig),
};

export const REGISTRY_GRAPH_CLIENTS = {
  mode: new GraphQLClient(process.env.NEXT_PUBLIC_MODE_REGISTRY_SUBGRAPH_URL, requestConfig),
  optimism: new GraphQLClient(
    process.env.NEXT_PUBLIC_OPTIMISM_REGISTRY_SUBGRAPH_URL,
    requestConfig
  ),
  gnosis: new GraphQLClient(process.env.NEXT_PUBLIC_GNOSIS_REGISTRY_SUBGRAPH_URL, requestConfig),
  base: new GraphQLClient(process.env.NEXT_PUBLIC_BASE_REGISTRY_SUBGRAPH_URL, requestConfig),
  celo: new GraphQLClient(process.env.NEXT_PUBLIC_CELO_REGISTRY_SUBGRAPH_URL, requestConfig),
  ethereum: new GraphQLClient(
    process.env.NEXT_PUBLIC_ETHEREUM_REGISTRY_SUBGRAPH_URL,
    requestConfig
  ),
  arbitrum: new GraphQLClient(
    process.env.NEXT_PUBLIC_ARBITRUM_REGISTRY_SUBGRAPH_URL,
    requestConfig
  ),
  polygon: new GraphQLClient(process.env.NEXT_PUBLIC_POLYGON_REGISTRY_SUBGRAPH_URL, requestConfig),
};

export const mechGraphClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_OLAS_MECH_SUBGRAPH_URL,
  requestConfig
);

export const predictAgentsGraphClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_OLAS_PREDICT_AGENTS_SUBGRAPH_URL,
  requestConfig
);

export const polymarketAgentsGraphClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_OLAS_POLYMARKET_AGENTS_SUBGRAPH_URL,
  requestConfig
);

export const MARKETPLACE_GRAPH_CLIENTS = {
  gnosis: new GraphQLClient(process.env.NEXT_PUBLIC_GNOSIS_MARKETPLACE_SUBGRAPH_URL, requestConfig),
  base: new GraphQLClient(process.env.NEXT_PUBLIC_BASE_MARKETPLACE_SUBGRAPH_URL, requestConfig),
  polygon: new GraphQLClient(
    process.env.NEXT_PUBLIC_POLYGON_MARKETPLACE_SUBGRAPH_URL,
    requestConfig
  ),
  optimism: new GraphQLClient(
    process.env.NEXT_PUBLIC_OPTIMISM_MARKETPLACE_SUBGRAPH_URL,
    requestConfig
  ),
};

export const BABYDEGEN_GRAPH_CLIENTS = {
  optimism: new GraphQLClient(
    process.env.NEXT_PUBLIC_OPTIMISM_BABYDEGEN_SUBGRAPH_URL,
    requestConfig
  ),
  mode: new GraphQLClient(process.env.NEXT_PUBLIC_MODE_BABYDEGEN_SUBGRAPH_URL, requestConfig),
};

export const MECH_FEES_GRAPH_CLIENTS = {
  gnosis: new GraphQLClient(
    process.env.NEXT_PUBLIC_NEW_MECH_FEES_GNOSIS_SUBGRAPH_URL,
    requestConfig
  ),
  base: new GraphQLClient(process.env.NEXT_PUBLIC_NEW_MECH_FEES_BASE_SUBGRAPH_URL, requestConfig),
};

export const legacyMechFeesGraphClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_LEGACY_MECH_FEES_GNOSIS_SUBGRAPH_URL,
  requestConfig
);

export const autonolasGraphClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_AUTONOLAS_SUBGRAPH_URL,
  requestConfig
);

export const autonolasBaseGraphClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_AUTONOLAS_BASE_SUBGRAPH_URL,
  requestConfig
);
