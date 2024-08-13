/* eslint-disable camelcase */
import useSWR from 'swr';
import qs from 'qs';
import get from 'lodash/get';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;
const fetcher = (...args) => fetch(...args).then((res) => res.json());

export const useFetchVideos = (limit = 1000) => {
  const params = {
    sort: ['date:desc'],
    populate: '*',
    'pagination[limit]': limit,
  };
  const stringifyParams = qs.stringify(params);
  const url = `${API_URL}/videos${params ? '?' : ''}${stringifyParams}`;
  const { data, isLoading } = useSWR(url, fetcher);
  const rawVideos = get(data, 'data') || [];

  const videos = rawVideos.map((video) => {
    const id = get(video, 'id');
    const attributes = get(video, 'attributes');
    const {
      title, date, platform_link, drive_link, platform, filename,
    } = attributes || {};
    const imageFilename = `${process.env.NEXT_PUBLIC_API_URL}${get(filename, 'data[0].attributes.url') || ''}`;

    return {
      id,
      title,
      date,
      platform_link,
      drive_link,
      platform,
      imageFilename,
    };
  });

  return { videos, isLoading };
};
