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
