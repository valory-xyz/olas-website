import { WindowedMetric } from 'common-util/api/predict/omenstrat-brier';
import { STAKING_GRAPH_CLIENTS } from 'common-util/graphql/client';
import { createStaleStatus, executeGraphQLQuery } from 'common-util/graphql/metric-utils';
import { stakingContractsQuery } from 'common-util/graphql/queries';
import { MetricWithStatus, WithMeta } from 'common-util/graphql/types';
import { getContractApr } from 'common-util/olasApr';
import { loadSnapshot } from 'common-util/snapshot-storage';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';
import { getAllStakingNominees } from 'common-util/web3';

export const STAKING_APR_CATEGORY = 'staking-apr';

const DAY = 86400;

type StakingChain = keyof typeof STAKING_GRAPH_CLIENTS;

const CHAIN_ID_TO_STAKING_CHAIN: Record<string, StakingChain> = {
  '10': 'optimism',
  '100': 'gnosis',
  '137': 'polygon',
  '8453': 'base',
  '34443': 'mode',
};

const ZERO_ADDRESS = `0x${'0'.repeat(40)}`;
const RETAINER_ADDRESS = `0x${'0'.repeat(36)}dead`;

type StakingContractsResponse = WithMeta<{
  stakingContracts: {
    id: string; // the staking instance address (same as `instance`)
    rewardsPerSecond: string;
    minStakingDeposit: string;
    numAgentInstances: string;
  }[];
}>;

// Accumulated per chain so past time-range tabs can be answered: contract APRs are
// immutable, but the *active* set (VoteWeighting nominees) changes over time.
export type ChainAprHistory = {
  // every contract ever seen as a nominee (lowercase address) -> its APR (%)
  contracts: Record<string, number>;
  // UTC-midnight day -> addresses nominated that day, appended by the nightly cron
  activeByDay: Record<string, string[]>;
};

export type StakingAprMetricsData = Partial<
  Record<StakingChain, MetricWithStatus<ChainAprHistory | null>>
>;

export type StakingAprSnapshot = {
  data: StakingAprMetricsData;
  timestamp: number;
};

// Nomination history predating this pipeline, reconstructed from the VoteWeighting
// AddNominee/RemoveNominee logs: the previous program generation (last de-nominated
// on 2026-08-01) had higher APRs than the current 4.5-5% contracts.
const SEED_APR_HISTORY: Partial<Record<StakingChain, { apr: number; lastActiveDay: number }>> = {
  gnosis: { apr: 138.5, lastActiveDay: Date.UTC(2026, 7, 1) / 1000 },
  polygon: { apr: 100, lastActiveDay: Date.UTC(2026, 7, 1) / 1000 },
};

const emptyAprWindows = (): WindowedMetric<number | null> => ({
  '7d': null,
  '30d': null,
  '90d': null,
  max: null,
});

// Max APR across contracts that were nominated at any point within each time range.
export const computeAprWindows = (
  history: ChainAprHistory | null | undefined,
  chain: StakingChain,
  nowSec = Math.floor(Date.now() / 1000)
): WindowedMetric<number | null> => {
  if (!history) return emptyAprWindows();
  const seed = SEED_APR_HISTORY[chain];

  const windowMax = (days: number | null): number | null => {
    const cutoff = days === null ? 0 : nowSec - days * DAY;
    let max: number | null = null;
    let anyActive = false;
    Object.entries(history.activeByDay).forEach(([day, addresses]) => {
      if (Number(day) < cutoff) return;
      addresses.forEach((address) => {
        anyActive = true;
        const apr = history.contracts[address];
        if (apr !== undefined && (max === null || apr > max)) max = apr;
      });
    });
    if (seed && seed.lastActiveDay >= cutoff) {
      anyActive = true;
      if (max === null || seed.apr > max) max = seed.apr;
    }
    // No programs nominated within the window → APR is genuinely 0, not unknown.
    if (max === null && !anyActive) return 0;
    return max;
  };

  return { '7d': windowMax(7), '30d': windowMax(30), '90d': windowMax(90), max: windowMax(null) };
};

/**
 * Per-chain APR history of the staking contracts nominated in the VoteWeighting
 * contract on Ethereum (getAllNominees) — the programs Olas keeps for voting and
 * keeps topping up with rewards. Each nightly run appends today's active set to the
 * accumulated history (merged here, so the handler saves with overwrite), letting
 * readers compute the max APR per time range via `computeAprWindows`.
 */
export const fetchAllStakingAprs = async (): Promise<StakingAprSnapshot | null> => {
  let nominees;
  try {
    nominees = await getAllStakingNominees();
  } catch (error) {
    // Without the nominee list there is no active set to record — bail out so the
    // handler 500s and the previous blob stays untouched.
    console.error('Error fetching staking nominees from VoteWeighting:', error);
    return null;
  }

  const addressesByChain = {} as Record<StakingChain, string[]>;
  nominees.forEach((nominee) => {
    const address = `0x${nominee.account.slice(-40)}`.toLowerCase();
    if (address === ZERO_ADDRESS || address === RETAINER_ADDRESS) return;
    const chain = CHAIN_ID_TO_STAKING_CHAIN[String(nominee.chainId)];
    if (!chain) return;
    (addressesByChain[chain] ??= []).push(address);
  });

  // The blob is written with overwrite (the merge happens here), so a transient read
  // failure must abort the run — proceeding with previous = null would republish an
  // empty accumulator and permanently erase the history. 'absent' is the bootstrap path.
  const loaded = await loadSnapshot({ category: STAKING_APR_CATEGORY });
  if (loaded.outcome === 'error') {
    console.error('Could not read previous staking-apr snapshot:', loaded.error);
    return null;
  }
  const previous =
    loaded.outcome === 'found' ? (loaded.snapshot.data as StakingAprMetricsData) : null;

  const today = getMidnightUtcTimestampDaysAgo(0);
  // Union with previously-seen chains: a chain whose programs are all de-nominated keeps
  // its history and gets an empty active day, so its windowed APR decays to 0 over time
  // instead of the chain vanishing from the blob (which would freeze the published APR).
  const chains = Array.from(
    new Set([...Object.keys(addressesByChain), ...Object.keys(previous ?? {})])
  ) as StakingChain[];
  const results = await Promise.all(
    chains.map(async (chain) => {
      const addresses = addressesByChain[chain] ?? [];
      const prev = previous?.[chain]?.value;

      if (addresses.length === 0) {
        return {
          value: {
            contracts: { ...prev?.contracts },
            activeByDay: { ...prev?.activeByDay, [String(today)]: [] },
          },
          status: createStaleStatus({ indexingErrors: [], fetchErrors: [] }),
        };
      }

      const fresh = await executeGraphQLQuery<StakingContractsResponse, Record<string, number>>({
        client: STAKING_GRAPH_CLIENTS[chain],
        chain,
        query: stakingContractsQuery(addresses),
        source: `staking:${chain}`,
        transform: (data) => {
          const aprByContract: Record<string, number> = {};
          (data?.stakingContracts || []).forEach((contract) => {
            aprByContract[contract.id.toLowerCase()] = getContractApr(contract);
          });
          return aprByContract;
        },
      });

      // The active list comes from the RPC, so append today's entry even when the
      // subgraph failed — known contracts keep their stored APRs. A nominee absent
      // from the subgraph (e.g. LST programs, filtered by its implementation
      // allow-list) simply never gets an APR and is ignored by computeAprWindows.
      const contracts = { ...prev?.contracts, ...fresh.value };
      const activeByDay = { ...prev?.activeByDay, [String(today)]: addresses };

      return { value: { contracts, activeByDay }, status: fresh.status };
    })
  );

  return {
    data: Object.fromEntries(chains.map((chain, i) => [chain, results[i]])),
    timestamp: Date.now(),
  };
};
