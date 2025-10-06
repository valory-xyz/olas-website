import { TOKEN_HOLDER_NETWORKS } from 'common-util/constants';
import { TOKENOMICS_GRAPH_CLIENTS } from 'common-util/graphql/client';
import { holderCountsQuery } from 'common-util/graphql/queries';

const toLowerCaseAddress = (address) => address.toLowerCase();

const fetchHolderCount = ({ key, token }) => {
  const client = TOKENOMICS_GRAPH_CLIENTS[key];
  if (!client) {
    return Promise.resolve(0);
  }

  return client
    .request(holderCountsQuery, { tokenId: toLowerCaseAddress(token) })
    .then((response) => Number(response?.token?.holderCount ?? 0));
};

const collectHolderCounts = () =>
  Promise.allSettled(
    TOKEN_HOLDER_NETWORKS.map((network) => fetchHolderCount(network)),
  );

const sumHolderCounts = (results) =>
  results.reduce((total, result) => {
    if (result.status !== 'fulfilled') {
      console.error('Failed to fetch holder count:', result.reason);
      return total;
    }

    return Number.isFinite(result.value) ? total + result.value : total;
  }, 0);

export const getTotalTokenHolders = async () => {
  const results = await collectHolderCounts();
  return sumHolderCounts(results);
};
