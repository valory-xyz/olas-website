import Link from 'next/link';

import { Spinner } from 'components/Spinner';
import Image from 'next/image';

import { CARD_CLASS } from 'common-util/classes';
import { formatDate } from 'common-util/formatDate';

type VideoItem = {
  id?: string;
  platform_link?: string;
  drive_link?: string;
  video_url?: string;
  apple_link?: string;
  spotify_link?: string;
  rss_link?: string;
  imageFilename?: string;
  title?: string;
  date?: string;
};

type VideoProps = {
  video: VideoItem;
};

const Video = ({ video }: VideoProps) => (
  <a
    href={
      video.platform_link ||
      video.drive_link ||
      video.video_url ||
      video.apple_link ||
      video.spotify_link ||
      video.rss_link ||
      '#'
    }
    target="_blank"
    rel="noopener noreferrer"
  >
    <div className={`${CARD_CLASS} max-w-full h-full overflow-hidden min-h-[300px] `}>
      {video.imageFilename && (
        <Image
          src={`${video.imageFilename}`}
          alt={video.title || 'Video thumbnail'}
          width={750}
          height={200}
          className="rounded-t-lg"
        />
      )}
      <div className="p-6 flex flex-col h-full">
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 truncate whitespace-normal min-h-[70px]">
          {video.title}
        </h2>
        <div className="text-gray-500 mt-auto">
          <span className="text-sm md:text-xl lg:text-sm">
            {video.date ? formatDate(video.date) : ''}
          </span>
        </div>
      </div>
    </div>
  </a>
);

type VideosProps = {
  isLoading?: boolean;
  videos?: VideoItem[];
  limit?: number;
  isMain?: boolean;
};

export const Videos = ({ isLoading, videos, limit, isMain }: VideosProps) => (
  <section>
    <div>
      <div>
        {isMain ? (
          ''
        ) : (
          <h2 className="mb-6 text-3xl lg:text-5xl tracking-tight font-extrabold text-gray-900 ">
            Videos & Podcasts
          </h2>
        )}

        {limit !== null && (
          <div className="mb-4">
            <Link
              href="/videos"
              className="text-xl text-purple-700 hover:text-purple-800 transition-colors duration-300"
            >
              See all
            </Link>
          </div>
        )}
      </div>

      {isLoading ? (
        <Spinner customClass="h-auto py-20" />
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <div key={video.id || Math.random()}>
              <Video video={video} />
            </div>
          ))}
        </div>
      )}
    </div>
  </section>
);

Videos.defaultProps = {
  isLoading: true,
  videos: [],
  limit: null,
};

export default Videos;
