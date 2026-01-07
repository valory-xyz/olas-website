/* eslint-disable camelcase */
import get from 'lodash/get';
import qs from 'qs';
import useSWR from 'swr';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

// @ts-expect-error TS(2556) FIXME: A spread argument must either have a tuple type or... Remove this comment to see the full error message
const fetcher = (...args) => fetch(...args).then((res) => res.json());

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
    const thumbnailUrl = get(thumbnail, 'data.attributes.url');
    const imageFilename = thumbnailUrl
      ? `${process.env.NEXT_PUBLIC_API_URL}${thumbnailUrl}`
      : '';

    const videoUploadedUrl = get(videoUploaded, 'data[0].attributes.url');
    const video_url = videoUploadedUrl
      ? `${process.env.NEXT_PUBLIC_API_URL}${videoUploadedUrl}`
      : '';

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
