/* eslint-disable camelcase */
import { getApiUrl } from 'common-util/getApiUrl';
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

const videoParams = ({ limit = 1000, isPodcast = false }) => ({
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
});

const toVideo = (video) => {
  const {
    id,
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
  } = video || {};
  const apiUrl = getApiUrl();
  const thumbnailUrl = get(thumbnail, 'url');
  const imageFilename = thumbnailUrl && apiUrl ? `${apiUrl}${thumbnailUrl}` : '';

  const videoUploadedUrl = get(videoUploaded, '[0].url');
  const video_url = videoUploadedUrl && apiUrl ? `${apiUrl}${videoUploadedUrl}` : '';

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
};

export const useFetchVideos = ({ limit = 1000, isPodcast = false }) => {
  const { data, isLoading } = useFetch('videos', videoParams({ limit, isPodcast }));
  const videos = (get(data, 'data') || []).map(toVideo);

  return { videos, isLoading };
};

/**
 * The same list `useFetchVideos` shows, fetched on the server — for the /videos
 * structured data, which must name exactly the cards the page renders. `[]` on failure.
 */
export const fetchVideos = async ({ limit = 1000, isPodcast = false } = {}) => {
  try {
    const params = qs.stringify(videoParams({ limit, isPodcast }));
    const json = await fetcher(`${API_URL}/videos?${params}`);
    return (get(json, 'data') || []).map(toVideo);
  } catch {
    return [];
  }
};
