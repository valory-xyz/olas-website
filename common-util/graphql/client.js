import { GraphQLClient } from 'graphql-request';

const requestConfig = {
  jsonSerializer: {
    parse: JSON.parse,
    stringify: JSON.stringify,
  },
};

export const tokenomicsGraphClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_GRAPH_ENDPOINT_MAINNET,
  requestConfig,
);

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
