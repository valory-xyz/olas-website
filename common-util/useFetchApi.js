/* eslint-disable camelcase */
import get from 'lodash/get';
import qs from 'qs';
import useSWR from 'swr';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;
const fetcher = (...args) => fetch(...args).then((res) => res.json());

const useFetch = (subUrl, params) => {
  const stringifyParams = qs.stringify(params);
  const url = `${API_URL}/${subUrl}${params ? '?' : ''}${stringifyParams}`;
  const { data, isLoading } = useSWR(url, fetcher);
  return { data, isLoading };
};

export const useFetchVideos = (limit = 1000) => {
  const params = {
    sort: ['date:desc'],
    populate: '*',
    'pagination[limit]': limit,
  };
  const { data, isLoading } = useFetch('videos', params);
  const rawVideos = get(data, 'data') || [];

  const videos = rawVideos.map((video) => {
    const id = get(video, 'id');
    const attributes = get(video, 'attributes');
    const {
      title,
      date,
      platform_link,
      drive_link,
      platform,
      thumbnail,
      video: videoUploaded,
    } = attributes || {};
    const imageFilename = `${process.env.NEXT_PUBLIC_API_URL}${get(thumbnail, 'data.attributes.url') || ''}`;
    const video_url = `${process.env.NEXT_PUBLIC_API_URL}${get(videoUploaded, 'data[0].attributes.url') || ''}`;

    return {
      id,
      title,
      date,
      platform_link,
      drive_link,
      platform,
      imageFilename,
      video_url,
    };
  });

  return { videos, isLoading };
};