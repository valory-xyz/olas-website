import { fetchMechMetrics } from './mech';
import { fetchMechFeeMetrics } from './mech-fees';

export const fetchAllAgentEconomiesMetrics = async () => {
  const [mech, mechFees] = await Promise.all([
    fetchMechMetrics(),
    fetchMechFeeMetrics(),
  ]);

  return {
    data: {
      mech,
      mechFees,
    },
    timestamp: Date.now(),
  };
};
