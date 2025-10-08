import { TOKENOMICS_GRAPH_CLIENTS } from 'common-util/graphql/client';
import { holderCountsQuery } from 'common-util/graphql/queries';
import tokens from 'data/tokens.json';

const toLowerCaseAddress = (address) => address.toLowerCase();

const TOKEN_HOLDER_NAME_MAP = {
  ethereum: 'Ethereum',
  arbitrum: 'Arbitrum',
  base: 'Base',
  celo: 'Celo',
  gnosis: 'Gnosis',
  optimism: 'Optimism',
  polygon: 'Polygon PoS',
  mode: 'Mode',
};

const tokenAddressLookup = tokens.reduce((lookup, token) => {
  lookup[token.name] = token.address;
  return lookup;
}, {});

export const TOKEN_HOLDER_NETWORKS = Object.entries(TOKEN_HOLDER_NAME_MAP).map(
  ([key, name]) => {
    const token = tokenAddressLookup[name];
    if (!token) {
      throw new Error(`Missing token address for ${name}`);
    }
    return { key, token };
  },
);

const fetchHolderCount = ({ key, token }) => {
  const client = TOKENOMICS_GRAPH_CLIENTS[key];
  if (!client) {
    return Promise.resolve(0);
  }

  return client
    .request(holderCountsQuery, { tokenId: toLowerCaseAddress(token) })
    .then((response) => Number(response?.token?.holderCount ?? 0))
    .catch((error) => {
      console.error(`Token holder subgraph request failed for ${key}:`, error);
      return 0;
    });
};

const collectHolderCounts = () =>
  Promise.all(
    TOKEN_HOLDER_NETWORKS.map((network) => fetchHolderCount(network)),
  );

const sumHolderCounts = (counts) =>
  counts.reduce(
    (total, value) => (Number.isFinite(value) ? total + value : total),
    0,
  );

export const getTotalTokenHolders = async () => {
  const counts = await collectHolderCounts();
  return sumHolderCounts(counts);
};
