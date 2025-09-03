export const calculate7DayAverage = (performances) => {
  if (performances.length === 0) return 0;
  const total = performances.reduce(
    (sum, p) => sum + Number(p.activeMultisigCount ?? 0),
    0,
  );
  return total / 7;
};
