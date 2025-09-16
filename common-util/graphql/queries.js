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

export const totalMechRequestsQuery = gql`
  query TotalMechRequests {
    global(id: "") {
      totalRequests
    }
  }
`;

export const mechMarketplaceTotalRequestsQuery = gql`
  query MechMarketplaceTotalRequests {
    global(id: "") {
      totalRequests
    }
  }
`;

export const mechGlobalsTotalRequestsQuery = gql`
  query MechGlobalsTotalRequests {
    global(id: "") {
      totalRequests
    }
  }
`;

export const getMechRequestsQuery = ({
  timestamp_gt,
  first,
  skip,
  pages,
}) => gql`
  query MechRequests {
    ${Array.from({ length: pages })
      .map((_, i) => {
        const _skip = i * first + skip;
        return `
          _page${i + 1}: requests(
            first: ${first}
            skip: ${_skip}
            where: { blockTimestamp_gt: ${timestamp_gt} }
          ) {
            id
            questionTitle
            blockTimestamp
          }
        `;
      })
      .join('\n')}
  }`;

export const getMarketsAndBetsQuery = (timestamp_gt) => gql`
  query MarketsAndBets {
    fixedProductMarketMakerCreations(
      where: { blockTimestamp_gt: ${timestamp_gt} }
    ) {
      id
      question
    }

    global(id: "") {
      totalFees
      totalPayout
      totalTraded
    }
  }
`;

export const stakingGlobalsQuery = gql`
  query StakingGlobals {
    global(id: "") {
      totalRewards
      currentOlasStaked
    }
  }
`;

export const getClosedMarketsBetsQuery = ({ first, pages }) => gql`
  query ClosedMarketsBets {
    ${Array.from({ length: pages })
      .map((_, i) => {
        const skip = i * first;
        return `
          _page${i + 1}: bets(
            first: ${first}
            skip: ${skip}
            where: { fixedProductMarketMaker_: { currentAnswer_not: null } }
            orderBy: timestamp
            orderDirection: desc
          ) {
            outcomeIndex
            fixedProductMarketMaker {
              id
              currentAnswer
            }
          }
        `;
      })
      .join('\n')}
  }
`;

export const dailyBabydegenPerformancesQuery = gql`
  query DailyPerformance($timestamp_gt: Int!, $timestamp_lt: Int!) {
    dailyAgentPerformances(
      where: {
        and: [
          { agentId: 40 }
          { dayTimestamp_gt: $timestamp_gt }
          { dayTimestamp_lt: $timestamp_lt }
        ]
      }
      orderBy: dayTimestamp
      orderDirection: desc
    ) {
      id
      activeMultisigCount
    }
  }
`;

export const dailyMechAgentPerformancesQuery = gql`
  query DailyPerformance($timestamp_gt: Int!, $timestamp_lt: Int!) {
    dailyAgentPerformances(
      where: {
        and: [
          {
            or: [
              { agentId: 9 }
              { agentId: 26 }
              { agentId: 29 }
              { agentId: 36 }
              { agentId: 37 }
            ]
          }
          { dayTimestamp_gt: $timestamp_gt }
          { dayTimestamp_lt: $timestamp_lt }
        ]
      }
      orderBy: dayTimestamp
      orderDirection: desc
    ) {
      id
      activeMultisigCount
    }
  }
`;

export const dailyPredictAgentsPerformancesQuery = gql`
  query DailyPredictPerformances(
    $agentIds: [Int!]!
    $timestamp_gt: Int!
    $timestamp_lt: Int!
  ) {
    dailyAgentPerformances(
      where: {
        and: [
          { agentId_in: $agentIds }
          { dayTimestamp_gt: $timestamp_gt }
          { dayTimestamp_lt: $timestamp_lt }
        ]
      }
      orderBy: dayTimestamp
      orderDirection: asc
      first: 1000
    ) {
      dayTimestamp
      activeMultisigCount
    }
  }
`;

export const agentTxCountsQuery = gql`
  query AgentTxs($agentIds: [Int!]!) {
    agentPerformances(
      where: { id_in: $agentIds }
      orderBy: id
      orderDirection: asc
    ) {
      id
      txCount
    }
  }
`;

export const dailyAgentPerformancesQuery = gql`
  query DailyActiveMultisigs($timestamp_gt: Int!, $timestamp_lt: Int!) {
    dailyActiveMultisigs_collection(
      where: {
        and: [
          { dayTimestamp_gt: $timestamp_gt }
          { dayTimestamp_lt: $timestamp_lt }
        ]
      }
      orderBy: dayTimestamp
      orderDirection: desc
    ) {
      id
      count
    }
  }
`;

export const registryGlobalsQuery = gql`
  query RegistryGlobals {
    global(id: "") {
      id
      txCount
    }
  }
`;

export const operatorGlobalsQuery = gql`
  query OperatorGlobals {
    globals {
      id
      totalOperators
    }
  }
`;

export const ataTransactionsQuery = gql`
  query AtaTransactions {
    globals(where: { id: "" }) {
      id
      totalAtaTransactions
    }
  }
`;

export const newMechFeesQuery = gql`
  query NewMechFees {
    global(id: "") {
      id
      totalFeesInUSD
    }
  }
`;

export const legacyMechFeesQuery = gql`
  query LegacyMechFees {
    global(id: "") {
      id
      totalFeesIn
    }
  }
`;

export const newMechFeesTotalsQuery = gql`
  query NewMechFeesTotals {
    global(id: "") {
      totalFeesInUSD
      totalFeesOutUSD
    }
  }
`;

export const legacyMechFeesTotalsQuery = gql`
  query LegacyMechFeesTotals {
    global(id: "") {
      totalFeesIn
      totalFeesOut
    }
  }
`;
