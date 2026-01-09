export const formatWeiNumber = (
  numberInWei: string | bigint,
  options: Intl.NumberFormatOptions = {
    notation: 'compact',
    maximumFractionDigits: 3,
  },
) => {
  const wei =
    typeof numberInWei === 'string' ? BigInt(numberInWei) : numberInWei;
  const ethInt = wei / 10n ** 18n;
  const ethFrac = wei % 10n ** 18n;
  const eth = Number(ethInt) + Number(ethFrac) / 1e18;
  return new Intl.NumberFormat('en', options).format(eth);
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
