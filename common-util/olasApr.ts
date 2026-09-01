const ONE_YEAR = 1 * 24 * 60 * 60 * 365;

type StakingContract = {
  rewardsPerSecond: string;
  minStakingDeposit: string;
  numAgentInstances: string | number;
};

// Theoretical max APR of one staking contract: yearly OLAS rewards per service over
// the total OLAS a service locks (deposit + one bond per agent instance).
export const getContractApr = (contract: StakingContract): number => {
  const rewardsPerYear = BigInt(contract.rewardsPerSecond) * BigInt(ONE_YEAR);
  const apy = (rewardsPerYear * BigInt(100)) / BigInt(contract.minStakingDeposit);
  return Number(apy) / (1 + Number(contract.numAgentInstances));
};

export const getMaxApr = (contracts: StakingContract[]) =>
  Math.max(...contracts.map(getContractApr));
