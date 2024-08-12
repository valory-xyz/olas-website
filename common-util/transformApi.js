/* eslint-disable camelcase */
import get from 'lodash/get';

export const transformVideosFromApi = (videos) => {
  if (!videos || videos.length === 0) return [];

  return videos.map((video) => {
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
};
