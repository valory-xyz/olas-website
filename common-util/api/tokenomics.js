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

const TOKEN_HOLDERS_ENDPOINT = '/api/token-holders';

const parseTotalTokenHolders = (response) => {
  const total = response?.totalTokenHolders;
  return Number.isFinite(total) ? total : null;
};

export const getTotalTokenHolders = async () => {
  try {
    const response = await fetch(TOKEN_HOLDERS_ENDPOINT);
    if (!response?.ok) {
      console.error(
        'Failed to fetch total token holders:',
        response?.statusText,
      );
      return null;
    }

    const json = await response.json();
    return parseTotalTokenHolders(json);
  } catch (error) {
    console.error('Error fetching total token holders:', error);
    return null;
  }
};
