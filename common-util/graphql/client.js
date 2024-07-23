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
)
