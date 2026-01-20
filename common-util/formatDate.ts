export const formatDate = (date: string | Date) => {
  const newDate = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
  };

  const formattedDate = newDate.toLocaleDateString('en-GB', options);
  return formattedDate.replace(/ /g, '-');
};
