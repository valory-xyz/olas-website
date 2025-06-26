import { gql } from 'graphql-request';

export const emissionsQuery = gql`
  {
    epoches(orderBy: startBlock) {
      id
      counter
      blockTimestamp
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
      (epoch, index) => `
        _${epoch.counter}: rewardUpdates(
          where: {
            blockTimestamp_gt: ${index > 0 ? epochs[index - 1].blockTimestamp : 0}
            ${index < epochs.length - 1 ? `blockTimestamp_lte: ${epoch.blockTimestamp}` : ''}
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

export const stakingContractsQuery = (addresses) => gql`
  {
    stakingContracts(where: {instance_in: [${addresses.map((address) => `"${address}"`)}]}) {
      id
      rewardsPerSecond
      minStakingDeposit
      numAgentInstances
    }
  }
`;
