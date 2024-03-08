import useSWR from 'swr';

const URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;
// eslint-disable-next-line no-console
export const fetcher = (...args) => fetch(...args).then((res) => console.log('res', res));

export const useBlogItems = async () => {
  // eslint-disable-next-line no-unused-vars
  const params = {
    sort: ['datePublished:desc'],
    populate: '*',
    'pagination[limit]': 1000,
  };

  const { data, error } = useSWR(`${URL}/blog-posts`, fetcher);

  return {
    blogItems: data.data,
    isLoading: !error && !data,
    isError: error,
  };
};
