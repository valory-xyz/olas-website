export const formatWeiNumber = (numberInWei) => {
  const formatter = Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 3,
  });
  return formatter.format(numberInWei / 10 ** 18);
};

export const formatChartNumber = (number) => {
  const formatter = Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 3,
  });
  return formatter.format(number);
};
