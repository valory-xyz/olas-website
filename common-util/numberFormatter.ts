export const formatWeiNumber = (
  numberInWei,
  options = {
    notation: 'compact',
    maximumFractionDigits: 3,
  },
) => {
  const formatter = Intl.NumberFormat('en', options);
  return formatter.format(numberInWei / 10 ** 18);
};

export const formatEthNumber = (
  numberInEth,
  options = {
    notation: 'compact',
    maximumFractionDigits: 3,
  },
) => {
  const formatter = Intl.NumberFormat('en', options);
  return formatter.format(numberInEth);
};
