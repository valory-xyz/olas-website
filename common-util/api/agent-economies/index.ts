import { fetchAgentsFunMetrics } from './agentsfun';
import { fetchBabyDegenMetrics } from './babydegen';
import { fetchConnectMetrics } from './connect';
import { fetchMechMetrics } from './mech';
import { fetchMechFeeMetrics } from './mech-fees';

export type AgentEconomiesMetricsData = {
  agentsFun: Awaited<ReturnType<typeof fetchAgentsFunMetrics>>;
  babyDegen: Awaited<ReturnType<typeof fetchBabyDegenMetrics>>;
  connect: Awaited<ReturnType<typeof fetchConnectMetrics>>;
  mech: Awaited<ReturnType<typeof fetchMechMetrics>>;
  mechFees: Awaited<ReturnType<typeof fetchMechFeeMetrics>>;
};

export type AgentEconomiesSnapshot = {
  data: AgentEconomiesMetricsData;
  timestamp: number;
};

export const fetchAllAgentEconomiesMetrics = async (): Promise<AgentEconomiesSnapshot> => {
  const [agentsFun, babyDegen, connect, mech, mechFees] = await Promise.all([
    fetchAgentsFunMetrics(),
    fetchBabyDegenMetrics(),
    fetchConnectMetrics(),
    fetchMechMetrics(),
    fetchMechFeeMetrics(),
  ]);

  return {
    data: {
      agentsFun,
      babyDegen,
      connect,
      mech,
      mechFees,
    },
    timestamp: Date.now(),
  };
};
