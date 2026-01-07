export const formatDate = (date) => {
  const newDate = new Date(date);
  const options = {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
  };

  // @ts-expect-error TS(2769) FIXME: No overload matches this call.
  const formattedDate = newDate.toLocaleDateString('en-GB', options);
  return formattedDate.replace(/ /g, '-');
};
