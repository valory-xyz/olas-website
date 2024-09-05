import { gql } from 'graphql-request';

export const emissionsQuery = gql`
  {
    epoches(orderBy: startBlock) {
      id
      counter
      availableDevIncentives
      devIncentivesTotalTopUp
      effectiveBond
      totalCreateProductsSupply
      totalCreateBondsAmountOLAS
      availableStakingIncentives
      totalStakingIncentives
    }
  }
`;
