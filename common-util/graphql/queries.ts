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
      `
    )}
  }
`;

export const stakingContractsQuery = (addresses) => gql`
  {
    _meta {
      hasIndexingErrors
    }
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
    _meta {
      hasIndexingErrors
      block {
        number
      }
    }
  }
`;

export const mechMarketplaceTotalRequestsQuery = gql`
  query MechMarketplaceTotalRequests {
    global(id: "") {
      totalRequests
      totalDeliveries
    }
    _meta {
      hasIndexingErrors
      block {
        number
      }
    }
  }
`;

export const getMechRequestsQuery = ({ timestamp_gt, first, skip, pages }) => gql`
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
    _meta {
      hasIndexingErrors
      block {
        number
      }
    }
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
    _meta {
      hasIndexingErrors
      block {
        number
      }
    }
  }
`;

export const stakingGlobalsQuery = gql`
  query StakingGlobals {
    global(id: "") {
      totalRewards
      currentOlasStaked
    }
    _meta {
      hasIndexingErrors
      block {
        number
      }
    }
  }
`;

export const dailyBabydegenPopulationMetricsQuery = ({ first = 10, timestampLte }: any = {}) => {
  const whereClause =
    typeof timestampLte === 'number' ? `where: { timestamp_lte: ${timestampLte} }` : '';

  return gql`
    {
      dailyPopulationMetrics(
        first: ${first}
        orderBy: timestamp
        orderDirection: desc
        ${whereClause}
      ) {
        timestamp
        totalFundedAUM
        medianUnrealisedPnL
        averageAgentDaysActive
        sma7dProjectedUnrealisedPnL
        sma7dEthAdjustedProjectedUnrealisedPnL
        medianAUM
      }
      _meta {
        hasIndexingErrors
        block {
          number
        }
      }
    }
  `;
};

export const dailyStakingGlobalsSnapshotsQuery = ({ first = 10, timestampLte }: any = {}) => {
  const whereClause =
    typeof timestampLte === 'number' ? `where: { timestamp_lte: ${timestampLte} }` : '';

  return gql`
    {
      cumulativeDailyStakingGlobals(
        first: ${first}
        orderBy: timestamp
        orderDirection: desc
        ${whereClause}
      ) {
        timestamp
        medianCumulativeRewards
        numServices
      }
      _meta {
        hasIndexingErrors
        block {
          number
        }
      }
    }
  `;
};

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
    _meta {
      hasIndexingErrors
      block {
        number
      }
    }
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
      dayTimestamp
      activeMultisigCount
    }
    _meta {
      hasIndexingErrors
      block {
        number
      }
    }
  }
`;

export const dailyAgentsFunPerformancesQuery = gql`
  query DailyPerformance($timestamp_gt: Int!, $timestamp_lt: Int!) {
    dailyAgentPerformances(
      where: {
        and: [
          { agentId: 43 }
          { dayTimestamp_gt: $timestamp_gt }
          { dayTimestamp_lt: $timestamp_lt }
        ]
      }
      orderBy: dayTimestamp
      orderDirection: desc
    ) {
      id
      dayTimestamp
      activeMultisigCount
    }
    _meta {
      hasIndexingErrors
      block {
        number
      }
    }
  }
`;

export const dailyMechAgentPerformancesQuery = gql`
  query DailyPerformance($timestamp_gt: Int!, $timestamp_lt: Int!) {
    dailyAgentPerformances(
      where: {
        and: [
          {
            or: [{ agentId: 9 }, { agentId: 26 }, { agentId: 29 }, { agentId: 36 }, { agentId: 37 }]
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
    _meta {
      hasIndexingErrors
      block {
        number
      }
    }
  }
`;

export const dailyPredictAgentsPerformancesQuery = gql`
  query DailyPredictPerformances($agentIds: [Int!]!, $timestamp_gt: Int!, $timestamp_lt: Int!) {
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
    _meta {
      hasIndexingErrors
      block {
        number
      }
    }
  }
`;

export const dailyPredictAgentPerformancesWithMultisigsQuery = gql`
  query DailyPredictAgentPerformancesWithMultisigs(
    $agentId_in: [Int!]!
    $dayTimestamp_gt: Int!
    $dayTimestamp_lt: Int!
  ) {
    dailyAgentPerformances(
      where: {
        and: [
          { agentId_in: $agentId_in }
          { dayTimestamp_gt: $dayTimestamp_gt }
          { dayTimestamp_lt: $dayTimestamp_lt }
        ]
      }
      orderBy: dayTimestamp
      orderDirection: asc
      first: 1000
    ) {
      dayTimestamp
      activeMultisigCount
      multisigs(first: 1000) {
        multisig {
          id
          serviceId
        }
      }
    }
    _meta {
      hasIndexingErrors
      block {
        number
      }
    }
  }
`;

export const checkpointsQuery = gql`
  query Checkpoints($contractAddress_in: [String!]!, $blockTimestamp_lte: Int!) {
    checkpoints(
      where: { contractAddress_in: $contractAddress_in, blockTimestamp_lte: $blockTimestamp_lte }
      orderBy: blockTimestamp
      orderDirection: desc
      first: 1000
    ) {
      contractAddress
      serviceIds
      blockTimestamp
    }
    _meta {
      hasIndexingErrors
      block {
        number
      }
    }
  }
`;

export const agentTxCountsQuery = gql`
  query AgentTxs($agentIds: [Int!]!) {
    agentPerformances(where: { id_in: $agentIds }, orderBy: id, orderDirection: asc) {
      id
      txCount
    }
    _meta {
      hasIndexingErrors
      block {
        number
      }
    }
  }
`;

export const dailyAgentPerformancesQuery = gql`
  query DailyActiveMultisigs($timestamp_gt: Int!, $timestamp_lt: Int!) {
    dailyActiveMultisigs_collection(
      where: { and: [{ dayTimestamp_gt: $timestamp_gt }, { dayTimestamp_lt: $timestamp_lt }] }
      orderBy: dayTimestamp
      orderDirection: desc
    ) {
      id
      count
    }
    _meta {
      hasIndexingErrors
      block {
        number
      }
    }
  }
`;

export const registryGlobalsQuery = gql`
  query RegistryGlobals {
    global(id: "") {
      id
      txCount
    }
    _meta {
      hasIndexingErrors
      block {
        number
      }
    }
  }
`;

export const operatorGlobalsQuery = gql`
  query OperatorGlobals {
    globals {
      id
      totalOperators
    }
    _meta {
      hasIndexingErrors
      block {
        number
      }
    }
  }
`;

export const ataTransactionsQuery = gql`
  query AtaTransactions {
    globals(where: { id: "" }) {
      id
      totalAtaTransactions
    }
    _meta {
      hasIndexingErrors
      block {
        number
      }
    }
  }
`;

export const newMechFeesQuery = gql`
  query NewMechFees {
    global(id: "") {
      id
      totalFeesInUSD
    }
    _meta {
      hasIndexingErrors
      block {
        number
      }
    }
  }
`;

export const legacyMechFeesQuery = gql`
  query LegacyMechFees {
    global(id: "") {
      id
      totalFeesIn
    }
    _meta {
      hasIndexingErrors
      block {
        number
      }
    }
  }
`;

export const newMechFeesTotalsQuery = gql`
  query NewMechFeesTotals {
    global(id: "") {
      totalFeesInUSD
      totalFeesOutUSD
    }
    _meta {
      hasIndexingErrors
      block {
        number
      }
    }
  }
`;

export const legacyMechFeesTotalsQuery = gql`
  query LegacyMechFeesTotals {
    global(id: "") {
      totalFeesIn
      totalFeesOut
    }
    _meta {
      hasIndexingErrors
      block {
        number
      }
    }
  }
`;

// Mech-Marketplace subgraphs: per-agent total requests
export const mechMarketplaceRequestsPerAgentsQuery = (ids) => gql`
  query MechMarketplaceRequestsPerAgents {
    requestsPerAgents(where: { id_in: [${ids.map((id) => `"${id}"`).join(', ')}] }) {
      id
      requestsCount
    }
    requestsPerAgentOnchains(where: { id_in: [${ids.map((id) => `"${id}"`).join(', ')}] }) {
      id
      requestsCount
    }
    _meta {
      hasIndexingErrors
      block {
        number
      }
    }
  }
`;

export const holderCountsQuery = gql`
  query HolderCounts($tokenId: ID!) {
    token(id: $tokenId) {
      holderCount
    }
    _meta {
      hasIndexingErrors
      block {
        number
      }
    }
  }
`;

export const getActiveVeOlasDepositorsQuery = ({ first, skip, pages, unlockAfter }) => gql`
  query ActiveVeOlasDepositors {
    ${Array.from({ length: pages })
      .map((_, i) => {
        const _skip = i * first + skip;
        return `
          _page${i + 1}: veolasDepositors(
            first: ${first}
            skip: ${_skip}
            where: { unlockTimestamp_gt: ${unlockAfter} }
            orderBy: unlockTimestamp
            orderDirection: asc
          ) {
            id
            unlockTimestamp
          }
        `;
      })
      .join('\n')}
    _meta {
      hasIndexingErrors
      block {
        number
      }
    }
  }
`;

export const veOlasLockedBalanceQuery = gql`
  query VeOlasLockedBalance($tokenId: ID!) {
    token(id: $tokenId) {
      balance
    }
    _meta {
      hasIndexingErrors
      block {
        number
      }
    }
  }
`;

export const totalBuildersQuery = gql`
  query TotalBuilders {
    globals {
      id
      totalBuilders
    }
    _meta {
      hasIndexingErrors
      block {
        number
      }
    }
  }
`;

export const dailyActivitiesQuery = gql`
  query DailyActivities(
    $first: Int
    $where: DailyActivity_filter
    $orderBy: DailyActivity_orderBy
    $orderDirection: OrderDirection
  ) {
    dailyActivities(
      first: $first
      where: $where
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      dayTimestamp
      count
      services
    }
    _meta {
      hasIndexingErrors
      block {
        number
      }
    }
  }
`;
