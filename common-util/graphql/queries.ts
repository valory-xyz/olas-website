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

export const balancerGetPoolQuery = (poolId: string) => gql`
  query GetPool {
    pool(id: "${poolId}") {
      tokens {
        address
        balance
      }
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
      block {
        number
      }
    }
    stakingContracts${addresses.length > 0 ? `(where: {instance_in: [${addresses.map((address) => `"${address}"`)}]})` : ''} {
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
            blockTimestamp
            parsedRequest {
              questionTitle
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
      totalFeesSettled
      totalPayout
      totalTradedSettled
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

export const getClosedMarketsBetsQuery = ({
  first,
  pages,
  includeBettorDetails = false,
}: {
  first: number;
  pages: number;
  includeBettorDetails?: boolean;
}) => gql`
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
            ${includeBettorDetails ? 'bettor { id }' : ''}
            outcomeIndex
            ${includeBettorDetails ? 'timestamp' : ''}
            fixedProductMarketMaker {
              ${includeBettorDetails ? '' : 'id'}
              currentAnswer
              ${includeBettorDetails ? 'question' : ''}
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

// Lean, cursor-paged resolved bets for the Explorer accuracy series. Uses a
// `timestamp_lt` cursor (not skip) so a deep one-time backfill stays O(1) per page —
// skip pagination is O(skip) on The Graph and the gateway rejects deep skips.
export const getExplorerBetsQuery = ({ first, timestamp_lt }) => gql`
  query ExplorerBets {
    bets(
      first: ${first}
      where: {
        and: [
          { fixedProductMarketMaker_: { currentAnswer_not: null } }
          { timestamp_lt: ${timestamp_lt} }
        ]
      }
      orderBy: timestamp
      orderDirection: desc
    ) {
      timestamp
      outcomeIndex
      fixedProductMarketMaker {
        currentAnswer
      }
    }
  }
`;

// Resolved Omen bets within a [timestamp_gte, timestamp_lt) window, cursor-paged.
// Powers the windowed prediction-accuracy accumulator (predict-accuracy/omenstrat):
// settled bets only (`currentAnswer_not: null`), bucketed by placement day. Uses a
// `timestamp_lt` cursor rather than skip so a 30-day backfill chunk stays O(1)/page.
export const getOmenBetsByTimeRangeQuery = ({ first, timestamp_gte, timestamp_lt }) => gql`
  query OmenBetsByTimeRange {
    bets(
      first: ${first}
      where: {
        and: [
          { fixedProductMarketMaker_: { currentAnswer_not: null } }
          { timestamp_gte: ${timestamp_gte} }
          { timestamp_lt: ${timestamp_lt} }
        ]
      }
      orderBy: timestamp
      orderDirection: desc
    ) {
      timestamp
      outcomeIndex
      fixedProductMarketMaker {
        currentAnswer
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

// Staking reward checkpoints within a [timestamp_gte, timestamp_lt) window, cursor-paged.
// Powers the windowed staking-rewards accumulator used by windowed final ROI.
// `contractAddresses` scopes to the predict staking programs (omenstrat → the 12
// PREDICT_STAKING_PROGRAMS_PEARL; polystrat → omit, the polygon staking subgraph is
// predict-only). `rewardAmount` is 1e18-scaled OLAS, summable across rows.
export const getStakingRewardsByTimeRangeQuery = ({
  first,
  contractAddresses,
  timestamp_gte,
  timestamp_lt,
}: {
  first: number;
  contractAddresses?: string[];
  timestamp_gte: number;
  timestamp_lt: number;
}) => {
  const contractFilter =
    contractAddresses && contractAddresses.length > 0
      ? `{ contractAddress_in: [${contractAddresses.map((a) => `"${a.toLowerCase()}"`).join(', ')}] }`
      : '';
  return gql`
  query StakingRewardsByTimeRange {
    serviceRewardsHistories(
      first: ${first}
      where: { and: [ ${contractFilter} { blockTimestamp_gte: ${timestamp_gte} } { blockTimestamp_lt: ${timestamp_lt} } ] }
      orderBy: blockTimestamp
      orderDirection: desc
    ) {
      rewardAmount
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
};

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

// Basius (Base) registers under agentId 115, unlike Modius/Optimus (agentId 40).
export const dailyBasiusPerformancesQuery = gql`
  query DailyPerformance($timestamp_gt: Int!, $timestamp_lt: Int!) {
    dailyAgentPerformances(
      where: {
        and: [
          { agentId: 115 }
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

// Like dailyPredictAgentsPerformancesQuery, but also pulls txCount and is paged
// (skip) so the Explorer can build the full daily DAA + transactions history.
export const explorerOmenstratSeriesQuery = gql`
  query ExplorerOmenstratSeries(
    $agentIds: [Int!]!
    $timestamp_gt: Int!
    $timestamp_lt: Int!
    $skip: Int!
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
      skip: $skip
    ) {
      dayTimestamp
      activeMultisigCount
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
    global(id: "") {
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
    global(id: "") {
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

export const getOmenDailyProfitStatsQuery = ({ date_gte, date_lte, first, skip }) => gql`
  query OmenDailyProfitStats {
    dailyProfitStatistics(
      first: ${first}
      skip: ${skip}
      where: { date_gte: ${date_gte}, date_lte: ${date_lte} }
      orderBy: date
      orderDirection: asc
    ) {
      traderAgent {
        id
      }
      date
      totalBets
      totalPayout
      dailyProfit
      dailyTradedSettled
      dailyFeesSettled
      profitParticipants {
        question
      }
    }
  }
`;

// Lean daily profit stats for the Explorer ROI series — only the fields needed to
// derive partial ROI (profit / (payout − profit)). Omits dailyTradedSettled /
// dailyFeesSettled so it works on subgraph versions that predate those fields.
export const getExplorerDailyProfitStatsQuery = ({ date_gte, date_lte, first, skip }) => gql`
  query ExplorerDailyProfitStats {
    dailyProfitStatistics(
      first: ${first}
      skip: ${skip}
      where: { date_gte: ${date_gte}, date_lte: ${date_lte} }
      orderBy: date
      orderDirection: desc
    ) {
      date
      totalBets
      totalPayout
      dailyProfit
    }
  }
`;

// Lean per-day Brier accumulators for windowed Brier-score aggregation.
// brierSum/brierCount are 1e18-scaled and summable across days; windowed mean
// Brier = sum(brierSum) / sum(brierCount). No traderAgent filter → platform-wide.
export const getOmenDailyBrierStatsQuery = ({ date_gte, date_lte, first, skip }) => gql`
  query OmenDailyBrierStats {
    dailyProfitStatistics(
      first: ${first}
      skip: ${skip}
      where: { date_gte: ${date_gte}, date_lte: ${date_lte} }
      orderBy: date
      orderDirection: asc
    ) {
      date
      brierSum
      brierCount
    }
    _meta {
      hasIndexingErrors
      block {
        number
      }
    }
  }
`;

export const getPolymarketDailyProfitStatsQuery = ({ date_gte, date_lte, first, skip }) => gql`
  query PolymarketDailyProfitStats {
    dailyProfitStatistics(
      first: ${first}
      skip: ${skip}
      where: { date_gte: ${date_gte}, date_lte: ${date_lte} }
      orderBy: date
      orderDirection: asc
    ) {
      traderAgent {
        id
      }
      date
      totalBets
      totalPayout
      dailyProfit
      profitParticipants {
        metadata {
          title
        }
      }
    }
  }
`;

export const getMechRequestsIncrementalQuery = ({
  timestamp_gt,
  first,
  skip,
}: {
  timestamp_gt: number;
  first: number;
  skip: number;
}) => gql`
  query MechRequestsIncremental {
    requests(
      first: ${first}
      skip: ${skip}
      where: { blockTimestamp_gt: "${timestamp_gt}" }
      orderBy: blockTimestamp
      orderDirection: asc
    ) {
      sender {
        id
      }
      blockTimestamp
      parsedRequest {
        questionTitle
      }
    }
  }
`;

export const getOmenTraderAgentsQuery = ({ first, skip }: { first: number; skip: number }) => gql`
  query OmenTraderAgents {
    traderAgents(first: ${first}, skip: ${skip}) {
      id
      totalTradedSettled
      totalFeesSettled
      totalPayout
      totalBets
    }
  }
`;

export const getPolymarketTraderAgentsQuery = ({
  first,
  skip,
}: {
  first: number;
  skip: number;
}) => gql`
  query PolymarketTraderAgents {
    traderAgents(first: ${first}, skip: ${skip}) {
      id
      totalTradedSettled
      totalPayout
      totalBets
    }
  }
`;

export const getMarketplaceSendersQuery = ({ first, skip }: { first: number; skip: number }) => gql`
  query MarketplaceSenders {
    senders(first: ${first}, skip: ${skip}) {
      id
      totalLegacyRequests
      totalMarketplaceRequests
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
    global(id: "") {
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

export const dailyContributePerformancesQuery = gql`
  query DailyPerformance($timestamp_gt: Int!, $timestamp_lt: Int!) {
    dailyAgentPerformances(
      where: {
        and: [
          { agentId: 41 }
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

// Query for ROI calculation of polymarket
export const getPolymarketMarketsDataQuery = ({
  first,
  pages,
}: {
  first: number;
  pages: number;
}) => {
  const queries = [];
  for (let i = 0; i < pages; i++) {
    queries.push(`
      page${i}: marketParticipants(
        first: ${first}
        skip: ${i * first}
        orderBy: createdAt
        orderDirection: desc
      ) {
        id
        question {
          id
          resolution {
            id
            winningIndex
          }
          metadata {
            id
            title
          }
        }
      }
    `);
  }

  return gql`
    query getPolymarketOpenMarkets {
      ${queries.join('\n')}
      global(id: "") {
        totalPayout
        totalTradedSettled
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

export const getMechRequestsBySenderWithToolQuery = ({
  sender,
  timestamp_gt,
  first,
  skip,
}: {
  sender: string;
  timestamp_gt: number;
  first: number;
  skip: number;
}) => gql`
  query MechRequestsBySender {
    requests(
      first: ${first}
      skip: ${skip}
      where: { sender: "${sender}", blockTimestamp_gt: "${timestamp_gt}" }
      orderBy: blockTimestamp
      orderDirection: desc
    ) {
      blockTimestamp
      parsedRequest {
        tool
        questionTitle
      }
    }
  }
`;

export const getPolymarketBetsQuery = ({ first, pages }: { first: number; pages: number }) => {
  const queries = [];
  for (let i = 0; i < pages; i++) {
    queries.push(`
      page${i}: bets(
        first: ${first}
        skip: ${i * first}
        orderBy: blockTimestamp
        orderDirection: desc
      ) {
        id
        outcomeIndex
        question {
          id
          resolution {
            id
            winningIndex
          }
        }
      }
    `);
  }
  return gql`query getPolymarketClosedMarkets { ${queries.join('\n')} _meta { hasIndexingErrors block { number } } }`;
};

// Polymarket bets within a [blockTimestamp_gte, blockTimestamp_lt) window, cursor-paged.
// Powers the windowed prediction-accuracy accumulator (predict-accuracy/polystrat),
// bucketed by placement day. Polymarket has no `currentAnswer` server-side filter, so
// unresolved bets are returned and skipped in code (counted later once they resolve).
export const getPolymarketBetsByTimeRangeQuery = ({
  first,
  blockTimestamp_gte,
  blockTimestamp_lt,
}) => gql`
  query PolymarketBetsByTimeRange {
    bets(
      first: ${first}
      where: {
        and: [
          { blockTimestamp_gte: ${blockTimestamp_gte} }
          { blockTimestamp_lt: ${blockTimestamp_lt} }
        ]
      }
      orderBy: blockTimestamp
      orderDirection: desc
    ) {
      blockTimestamp
      outcomeIndex
      question {
        resolution {
          winningIndex
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

export const getPolymarketBetsWithBettorQuery = ({
  first,
  pages,
}: {
  first: number;
  pages: number;
}) => {
  const queries = [];
  for (let i = 0; i < pages; i++) {
    queries.push(`
      page${i}: bets(
        first: ${first}
        skip: ${i * first}
        orderBy: blockTimestamp
        orderDirection: desc
      ) {
        id
        blockTimestamp
        outcomeIndex
        bettor {
          id
        }
        question {
          id
          metadata {
            title
          }
          resolution {
            winningIndex
          }
        }
      }
    `);
  }
  return gql`query PolymarketBetsWithBettor { ${queries.join('\n')} _meta { hasIndexingErrors block { number } } }`;
};

// cumulativeFeesUsd / cumulativeExternalFeesUsd are fetched for schema parity
// with pol-aggregation.js but not consumed by the app today. Only
// cumulativeProtocolFeesUsd is read (it's already Treasury-share-scaled).
export const liquidityEthQuery = gql`
  query LiquidityEth {
    lptokenMetrics(id: "global") {
      treasuryPercentage
      ethUsdPrice
      maticUsdPrice
      solUsdPrice
      poolLiquidityUsd
      protocolOwnedLiquidityUsd
      cumulativeProtocolFeesUsd
    }
    bridgedPOLHoldings(first: 10) {
      id
      originChain
      pair
      currentBalance
    }
    _meta {
      hasIndexingErrors
      block {
        number
      }
    }
  }
`;

// Multi-pool chains (e.g. Base has OLAS-USDC + WETH-OLAS) require first: 10.
// orderBy: id keeps dispatch deterministic across reindexes.
export const liquidityL2Query = gql`
  query LiquidityL2 {
    poolMetrics_collection(first: 10, orderBy: id, orderDirection: asc) {
      id
      reserve0
      reserve1
      totalSupply
      celoUsdPrice
      cumulativeFeesToken0
      cumulativeFeesToken1
    }
    _meta {
      hasIndexingErrors
      block {
        number
      }
    }
  }
`;

export const getMechRequestsBySenderEntityQuery = ({
  sender,
  timestamp_gt,
  first,
  skip,
}: {
  sender: string;
  timestamp_gt: number;
  first: number;
  skip: number;
}) => gql`
  query MechSenderRequests {
    sender(id: "${sender}") {
      requests(
        first: ${first}
        skip: ${skip}
        where: { blockTimestamp_gt: "${timestamp_gt}" }
      ) {
        blockTimestamp
        parsedRequest {
          tool
          questionTitle
        }
      }
    }
  }
`;
