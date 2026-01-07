export const formatWeiNumber = (
  numberInWei,
  options = {
    notation: 'compact',
    maximumFractionDigits: 3,
  },
) => {
  // @ts-expect-error TS(2345) FIXME: Argument of type '{ notation: string; maximumFract... Remove this comment to see the full error message
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
  // @ts-expect-error TS(2345) FIXME: Argument of type '{ notation: string; maximumFract... Remove this comment to see the full error message
  const formatter = Intl.NumberFormat('en', options);
  return formatter.format(numberInEth);
};
