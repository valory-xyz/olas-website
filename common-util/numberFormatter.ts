export const formatWeiNumber = (
  numberInWei: number | string,
  options: Intl.NumberFormatOptions = {
    notation: 'compact',
    maximumFractionDigits: 3,
  },
) => {
  const formatter = Intl.NumberFormat('en', options);
  return formatter.format(Number(numberInWei) / 10 ** 18);
};

export const formatEthNumber = (
  numberInEth: number | string,
  options: Intl.NumberFormatOptions = {
    notation: 'compact',
    maximumFractionDigits: 3,
  },
) => {
  const formatter = Intl.NumberFormat('en', options);
  return formatter.format(Number(numberInEth));
};
