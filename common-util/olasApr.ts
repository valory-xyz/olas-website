const ONE_YEAR = 1 * 24 * 60 * 60 * 365;

type StakingContract = {
  rewardsPerSecond: string;
  minStakingDeposit: string;
  numAgentInstances: string | number;
};

// Theoretical max APR of one staking contract: yearly OLAS rewards per service over
// the total OLAS a service locks (deposit + one bond per agent instance).
// Null when the deposit is missing, which the staking subgraph now stores as 0 for a
// contract whose `minStakingDeposit()` reverted — dividing by it would throw and take
// down the whole refresh.
export const getContractApr = (contract: StakingContract): number | null => {
  const minStakingDeposit = BigInt(contract.minStakingDeposit);
  if (minStakingDeposit === BigInt(0)) {
    console.error('Staking contract has no minStakingDeposit, skipping its APR');
    return null;
  }

  const rewardsPerYear = BigInt(contract.rewardsPerSecond) * BigInt(ONE_YEAR);
  const apy = (rewardsPerYear * BigInt(100)) / minStakingDeposit;
  return Number(apy) / (1 + Number(contract.numAgentInstances));
};

export const getMaxApr = (contracts: StakingContract[]) => {
  const aprs = contracts.map(getContractApr).filter((apr): apr is number => apr !== null);
  return aprs.length > 0 ? Math.max(...aprs) : null;
};
