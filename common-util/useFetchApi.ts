/* eslint-disable camelcase */
import get from 'lodash/get';
import qs from 'qs';
import useSWR from 'swr';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const useFetch = (subUrl, params) => {
  const stringifyParams = qs.stringify(params);
  const url = `${API_URL}/${subUrl}${params ? '?' : ''}${stringifyParams}`;
  const { data, isLoading } = useSWR(url, fetcher);
  return { data, isLoading };
};

export const useFetchVideos = ({ limit = 1000, isPodcast = false }) => {
  const params = {
    sort: ['date:desc'],
    populate: '*',
    'pagination[limit]': limit,
    filters: isPodcast
      ? {
          $or: [
            { apple_link: { $notNull: true } },
            { spotify_link: { $notNull: true } },
            { rss_link: { $notNull: true } },
          ],
        }
      : undefined,
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
      apple_link,
      spotify_link,
      rss_link,
      thumbnail,
      video: videoUploaded,
    } = attributes || {};
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL &&
      process.env.NEXT_PUBLIC_API_URL !== '__URL__'
        ? process.env.NEXT_PUBLIC_API_URL
        : '';
    const thumbnailUrl = get(thumbnail, 'data.attributes.url');
    const imageFilename =
      thumbnailUrl && apiUrl ? `${apiUrl}${thumbnailUrl}` : '';

    const videoUploadedUrl = get(videoUploaded, 'data[0].attributes.url');
    const video_url =
      videoUploadedUrl && apiUrl ? `${apiUrl}${videoUploadedUrl}` : '';

    return {
      id,
      title,
      date,
      platform_link,
      drive_link,
      platform,
      apple_link,
      spotify_link,
      rss_link,
      imageFilename,
      video_url,
    };
  });

  return { videos, isLoading };
};
