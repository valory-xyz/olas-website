import tokens from 'data/tokens.json';

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
