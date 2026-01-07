import { fetchAgentsFunMetrics } from './agentsfun';
import { fetchBabyDegenMetrics } from './babydegen';
import { fetchMechMetrics } from './mech';
import { fetchMechFeeMetrics } from './mech-fees';

export const fetchAllAgentEconomiesMetrics = async () => {
  const [agentsFun, babyDegen, mech, mechFees] = await Promise.all([
    fetchAgentsFunMetrics(),
    fetchBabyDegenMetrics(),
    fetchMechMetrics(),
    fetchMechFeeMetrics(),
  ]);

  return {
    data: {
      agentsFun,
      babyDegen,
      mech,
      mechFees,
    },
    timestamp: Date.now(),
  };
};
