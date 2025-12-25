import {
  GNOSIS_STAKING_CONTRACTS,
  PREDICT_AGENT_CLASSIFICATION,
} from 'common-util/constants';
import {
  REGISTRY_GRAPH_CLIENTS,
  STAKING_GRAPH_CLIENTS,
} from 'common-util/graphql/client';
import {
  agentTxCountsQuery,
  dailyPredictAgentsPerformancesQuery,
  stakingContractsQuery,
} from 'common-util/graphql/queries';
import { getMaxApr } from 'common-util/olasApr';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';

const CACHE_DURATION_SECONDS = 12 * 60 * 60; // 12 hours

const PREDICT_AGENT_IDS_FLAT = Object.values(PREDICT_AGENT_CLASSIFICATION)
  .flat()
  .map((n) => Number(n));

const fetchPredictDaa7dAvg = async () => {
  try {
    const timestamp_lt = getMidnightUtcTimestampDaysAgo(0);
    const timestamp_gt = getMidnightUtcTimestampDaysAgo(8);

    const { dailyAgentPerformances: rows = [] } =
      await REGISTRY_GRAPH_CLIENTS.gnosis.request(
        dailyPredictAgentsPerformancesQuery,
        {
          agentIds: PREDICT_AGENT_IDS_FLAT,
          timestamp_gt,
          timestamp_lt,
        },
      );

    const totalsByDay = new Map();
    rows.forEach((r) => {
      const key = new Date(Number(r.dayTimestamp) * 1000)
        .toISOString()
        .slice(0, 10);
      const prev = totalsByDay.get(key) || 0;
      totalsByDay.set(key, prev + Number(r.activeMultisigCount || 0));
    });

    const dayKeys = [];
    for (let i = 7; i >= 1; i -= 1) {
      const ts = timestamp_lt - i * 24 * 60 * 60;
      dayKeys.push(new Date(ts * 1000).toISOString().slice(0, 10));
    }

    const total = dayKeys.reduce(
      (acc, k) => acc + (totalsByDay.get(k) || 0),
      0,
    );
    return Math.floor(total / 7);
  } catch (error) {
    throw error;
  }
};

const fetchPredictTxsByAgentType = async () => {
  try {
    const response = await REGISTRY_GRAPH_CLIENTS.gnosis.request(
      agentTxCountsQuery,
      { agentIds: PREDICT_AGENT_IDS_FLAT },
    );

    const rows = response?.agentPerformances || [];
    const idToTx = new Map();
    rows.forEach((row) => {
      idToTx.set(String(row.id), BigInt(row.txCount || 0));
    });

    const result = {};
    Object.entries(PREDICT_AGENT_CLASSIFICATION).forEach(([category, ids]) => {
      let sum = 0n;
      ids.forEach((id) => {
        sum += idToTx.get(String(Number(id))) || 0n;
      });
      result[category] = Number(sum);
    });

    return result;
  } catch (error) {
    throw error;
  }
};

const fetchOlasApr = async () => {
  try {
    const contractsResult = await STAKING_GRAPH_CLIENTS.gnosis.request(
      stakingContractsQuery(GNOSIS_STAKING_CONTRACTS),
    );

    const gnosisContracts = contractsResult?.stakingContracts;

    return getMaxApr(gnosisContracts);
  } catch (error) {
    throw error;
  }
};

const fetchAllAgentMetrics = async () => {
  try {
    const [aprResult, daaResult, txsByTypeResult] = await Promise.allSettled([
      fetchOlasApr(),
      fetchPredictDaa7dAvg(),
      fetchPredictTxsByAgentType(),
    ]);

    const metrics = {
      apr: null,
      dailyActiveAgents: null,
      predictTxsByType: null,
    };

    // Process the results from Promise.allSettled
    if (aprResult.status === 'fulfilled') {
      metrics.apr = aprResult.value;
    } else {
      console.error('Fetch APR for predict failed:', aprResult.reason);
    }

    if (daaResult.status === 'fulfilled') {
      metrics.dailyActiveAgents = daaResult.value;
    } else {
      console.error('Fetch DAA for predict failed:', daaResult.reason);
    }

    if (txsByTypeResult.status === 'fulfilled') {
      metrics.predictTxsByType = txsByTypeResult.value;
    } else {
      console.error(
        'Fetch Predict txs by agent type failed:',
        txsByTypeResult.reason,
      );
    }

    const data = {
      data: metrics,
      timestamp: Date.now(),
    };

    return data;
  } catch (error) {
    console.error('Error fetching predict metrics:', error);
    return null;
  }
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  res.setHeader(
    'Vercel-CDN-Cache-Control',
    `s-maxage=${CACHE_DURATION_SECONDS}`,
  );
  res.setHeader('CDN-Cache-Control', `s-maxage=${CACHE_DURATION_SECONDS}`);
  res.setHeader(
    'Cache-Control',
    `public, s-maxage=${CACHE_DURATION_SECONDS}, stale-while-revalidate=${CACHE_DURATION_SECONDS * 2}`,
  );

  try {
    const latestMetrics = await fetchAllAgentMetrics();
    if (latestMetrics) {
      return res.status(200).json(latestMetrics.data);
    }

    return res.status(404).json({ error: 'Data is empty' });
  } catch (error) {
    console.error('Error in handler:', error);
    return res
      .status(500)
      .json({ error: 'Failed to fetch agent performance values.' });
  }
}
