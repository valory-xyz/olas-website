import { gql } from 'graphql-request';

export const emissionsQuery = gql`
  {
    epoches(orderBy: startBlock) {
      id
      counter
      startBlock
      endBlock
      availableDevIncentives
      devIncentivesTotalTopUp
      availableStakingIncentives
      totalStakingIncentives
      totalBondsClaimable
      totalBondsClaimed
    }
  }
`;

export const rewardUpdates = (epochs) => gql`
  query RewardUpdates {
    ${epochs.map(
      (epoch) => `
        _${epoch.counter}: rewardUpdates(
          where: {
            blockNumber_gte: ${epoch.startBlock}
            ${epoch.endBlock !== null && epoch.endBlock !== undefined ? `blockNumber_lte: ${epoch.endBlock}` : ''}
          }
            first: 1000
        ) {
          id
          amount
          type
        }
      `,
    )}
  }
`;
