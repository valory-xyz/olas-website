export const formatWeiNumber = (numberInWei) => {
  const formatter = Intl.NumberFormat('en', { notation: 'compact' });
  return formatter.format(numberInWei / 10 ** 18);
};
