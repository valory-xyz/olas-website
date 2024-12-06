export const formatDate = (date) => {
  const newDate = new Date(date);
  const options = {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
  };
  const formattedDate = newDate.toLocaleDateString('en-GB', options);
  return formattedDate.replace(/ /g, '-');
};
