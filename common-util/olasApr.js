const ONE_YEAR = 1 * 24 * 60 * 60 * 365;

export const getMaxApr = (contracts) => {
  return Math.max(
    ...contracts.map((contract) => {
      const rewardsPerYear =
        BigInt(contract.rewardsPerSecond) * BigInt(ONE_YEAR);
      const apy =
        (rewardsPerYear * BigInt(100)) / BigInt(contract.minStakingDeposit);
      return Number(apy) / (1 + Number(contract.numAgentInstances));
    }),
  );
};
