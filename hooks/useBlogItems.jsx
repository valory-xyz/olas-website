import useSWR from 'swr';

const URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;
export const fetcher = (...args) => fetch(...args).then(res => console.log('res', res));

export const useBlogItems = async () => {
  const params = {
    sort: ['datePublished:desc'],
    populate: '*',
    'pagination[limit]': 1000,
  };

  const { data, error } = useSWR(`${URL}/blog-posts`, fetcher);


  console.log('data', data.data);

  return {
    blogItems: data.data,
    isLoading: !error && !data,
    isError: error
  };
};
