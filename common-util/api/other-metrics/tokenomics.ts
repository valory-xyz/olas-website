import { OLAS_API_URL, OLAS_SUPPLY_DISTRIBUTION_ADDRESSES } from 'common-util/constants';
import { STAKING_GRAPH_CLIENTS, TOKENOMICS_GRAPH_CLIENTS } from 'common-util/graphql/client';
import {
  checkSubgraphLag,
  createStaleStatus,
  getChainBlockNumber,
  getFetchErrorAndCreateStaleStatus,
} from 'common-util/graphql/metric-utils';
import { emissionsQuery, rewardUpdates } from 'common-util/graphql/queries';
import { MetricWithStatus, WithMeta } from 'common-util/graphql/types';
import { readOlasContract, readTokenomicsContract } from 'common-util/web3';
import { isNil } from 'lodash';
import { formatEther } from 'viem';

// Years 0-12 of the max emission schedule shown on the /olas-token bar chart
// (10y capped schedule + the first years of the 2%/yr tail).
const INFLATION_YEARS = 13;

type SupplyDistribution = {
  totalSupplyWei: string;
  veOlasWei: string;
  daoWei: string;
  valoryWei: string;
  circulatingSupplyWei: string;
};

type EmissionSchedule = {
  timeLaunch: number;
  currentYear: number;
  inflationForYear: (string | null)[];
};

type EpochDistribution = {
  epoch: number;
  split: {
    staking: number;
    bonders: number;
    developers: number;
  };
};

type SubgraphEpoch = {
  id: string;
  counter: number;
  blockTimestamp: string;
  availableDevIncentives: string;
  devIncentivesTotalTopUp: string;
  availableStakingIncentives: string;
  totalStakingIncentives: string;
  totalBondsClaimable: string;
  totalBondsClaimed: string;
};

export type EmissionEpoch = SubgraphEpoch & {
  totalClaimableStakingRewards: string;
  totalClaimedStakingRewards: string;
};

type EmissionsResult = WithMeta<{ epoches?: SubgraphEpoch[] }>;
type RewardUpdate = { id: string; amount: string; type: string };
type RewardUpdatesResult = WithMeta<Record<string, RewardUpdate[]>>;

const fetchSupplyDistribution = async (): Promise<MetricWithStatus<SupplyDistribution | null>> => {
  try {
    const [totalSupplyResponse, veOlas, dao, valory] = await Promise.all([
      fetch(`${OLAS_API_URL}/total_supply`),
      readOlasContract<bigint>('balanceOf', [OLAS_SUPPLY_DISTRIBUTION_ADDRESSES.veOlas]),
      readOlasContract<bigint>('balanceOf', [OLAS_SUPPLY_DISTRIBUTION_ADDRESSES.dao]),
      readOlasContract<bigint>('balanceOf', [OLAS_SUPPLY_DISTRIBUTION_ADDRESSES.valory]),
    ]);

    if (!totalSupplyResponse.ok) {
      throw new Error(`OLAS total_supply HTTP ${totalSupplyResponse.status}`);
    }
    const json = (await totalSupplyResponse.json()) as {
      data?: { totalSupply?: string | number };
    };
    const raw = json?.data?.totalSupply;
    if (isNil(raw)) {
      throw new Error('OLAS total_supply: missing data.totalSupply');
    }

    const totalSupply = BigInt(raw);
    const circulatingSupply =
      totalSupply > 0n ? totalSupply - (veOlas + dao + valory) : 0n;

    return {
      value: {
        totalSupplyWei: String(totalSupply),
        veOlasWei: String(veOlas),
        daoWei: String(dao),
        valoryWei: String(valory),
        circulatingSupplyWei: String(circulatingSupply),
      },
      status: createStaleStatus({ indexingErrors: [], fetchErrors: [], laggingSubgraphs: [] }),
    };
  } catch (error) {
    console.error('Error fetching OLAS supply distribution:', error);
    return {
      value: null,
      status: getFetchErrorAndCreateStaleStatus('tokenomics:supply-distribution'),
    };
  }
};

const fetchEmissionSchedule = async (): Promise<MetricWithStatus<EmissionSchedule | null>> => {
  try {
    const [timeLaunch, currentYear, inflationForYear] = await Promise.all([
      readTokenomicsContract<bigint>('timeLaunch'),
      readTokenomicsContract<bigint>('currentYear'),
      Promise.all(
        Array.from({ length: INFLATION_YEARS }, (_, year) =>
          readTokenomicsContract<bigint>('getActualInflationForYear', [year])
            .then((result) => formatEther(BigInt(result)))
            .catch((error) => {
              console.error(`Error in getActualInflationForYear for year ${year}:`, error);
              return null;
            })
        )
      ),
    ]);

    return {
      value: {
        timeLaunch: Number(timeLaunch),
        currentYear: Number(currentYear),
        inflationForYear,
      },
      status: createStaleStatus({
        indexingErrors: [],
        fetchErrors: inflationForYear.some(isNil) ? ['tokenomics:inflation-for-year'] : [],
        laggingSubgraphs: [],
      }),
    };
  } catch (error) {
    console.error('Error fetching OLAS emission schedule:', error);
    return {
      value: null,
      status: getFetchErrorAndCreateStaleStatus('tokenomics:emission-schedule'),
    };
  }
};

const fetchEpochDistribution = async (): Promise<MetricWithStatus<EpochDistribution | null>> => {
  try {
    const epoch = await readTokenomicsContract<bigint>('epochCounter');

    // A single named-tuple output (mapEpochTokenomics) decodes to an object keyed
    // by struct field names; multiple outputs (mapEpochStakingPoints) decode to an
    // array — index 3 is stakingFraction. See common-util/web3.ts.
    const [tokenomicsPoints, stakingPoints] = await Promise.all([
      readTokenomicsContract<{ maxBondFraction: number | bigint }>('mapEpochTokenomics', [epoch]),
      readTokenomicsContract<Array<number | bigint>>('mapEpochStakingPoints', [epoch]),
    ]);

    const bonders = Number(tokenomicsPoints.maxBondFraction);
    const staking = Number(stakingPoints[3]);
    const developers = 100 - (staking + bonders);

    return {
      value: {
        epoch: Number(epoch),
        split: { staking, bonders, developers },
      },
      status: createStaleStatus({ indexingErrors: [], fetchErrors: [], laggingSubgraphs: [] }),
    };
  } catch (error) {
    console.error('Error fetching OLAS epoch distribution:', error);
    return {
      value: null,
      status: getFetchErrorAndCreateStaleStatus('tokenomics:epoch-distribution'),
    };
  }
};

const fetchEmissions = async (): Promise<MetricWithStatus<EmissionEpoch[] | null>> => {
  const indexingErrors: string[] = [];
  const fetchErrors: string[] = [];
  const laggingSubgraphs: string[] = [];

  try {
    const [emissionsData, ethereumBlock] = await Promise.all([
      TOKENOMICS_GRAPH_CLIENTS.ethereum.request(emissionsQuery) as Promise<EmissionsResult>,
      getChainBlockNumber('ethereum'),
    ]);

    if (emissionsData._meta?.hasIndexingErrors) {
      indexingErrors.push('emissions:tokenomics:ethereum');
    }
    if (checkSubgraphLag(ethereumBlock, emissionsData._meta?.block?.number, 'ethereum')) {
      laggingSubgraphs.push('emissions:tokenomics:ethereum');
    }

    const epoches = emissionsData.epoches || [];
    const query = rewardUpdates(epoches);

    const stakingResults = await Promise.all(
      Object.entries(STAKING_GRAPH_CLIENTS).map(async ([chain, client]) => {
        try {
          const [rewards, chainBlock] = await Promise.all([
            client.request(query) as Promise<RewardUpdatesResult>,
            getChainBlockNumber(chain),
          ]);
          if (rewards._meta?.hasIndexingErrors) {
            indexingErrors.push(`emissions:staking:${chain}`);
          }
          if (checkSubgraphLag(chainBlock, rewards._meta?.block?.number, chain)) {
            laggingSubgraphs.push(`emissions:staking:${chain}`);
          }
          return rewards;
        } catch (error) {
          console.error(`Error fetching reward updates from ${chain}:`, error);
          fetchErrors.push(`emissions:staking:${chain}`);
          return null;
        }
      })
    );

    const value = epoches.map((epoch) => {
      let totalClaimableStakingRewards = 0n;
      let totalClaimedStakingRewards = 0n;

      stakingResults.forEach((rewards) => {
        if (!rewards) return;
        const epochRewards = rewards[`_${epoch.counter}`] || [];
        epochRewards.forEach((item) => {
          if (item.type === 'Claimable') {
            totalClaimableStakingRewards += BigInt(item.amount);
          } else if (item.type === 'Claimed') {
            totalClaimedStakingRewards += BigInt(item.amount);
          }
        });
      });

      return {
        ...epoch,
        totalClaimableStakingRewards: String(totalClaimableStakingRewards),
        totalClaimedStakingRewards: String(totalClaimedStakingRewards),
      };
    });

    return {
      value,
      status: createStaleStatus({ indexingErrors, fetchErrors, laggingSubgraphs }),
    };
  } catch (error) {
    console.error('Error fetching emissions data:', error);
    return {
      value: null,
      status: getFetchErrorAndCreateStaleStatus('emissions:tokenomics:ethereum'),
    };
  }
};

export const fetchTokenomicsMetrics = async () => {
  const [supplyDistribution, emissionSchedule, epochDistribution, emissions] = await Promise.all([
    fetchSupplyDistribution(),
    fetchEmissionSchedule(),
    fetchEpochDistribution(),
    fetchEmissions(),
  ]);

  return { supplyDistribution, emissionSchedule, epochDistribution, emissions };
};

export type TokenomicsMetrics = Awaited<ReturnType<typeof fetchTokenomicsMetrics>>;
