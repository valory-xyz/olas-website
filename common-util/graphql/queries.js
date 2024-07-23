import { gql } from "graphql-request";

export const emissionsQuery = gql`
  {
    epoches(orderBy: startBlock) {
      id
      counter
      devIncentivesTotalTopUp
    }
  }
`;
