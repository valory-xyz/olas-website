export const calculate7DayAverage = (items, key) => {
  if (!items || items.length === 0) return 0;

  const total = items.reduce((sum, item) => sum + Number(item?.[key] ?? 0), 0);

  return total / 7;
};
