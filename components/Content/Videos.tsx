import Link from 'next/link';

import { Spinner } from 'components/Spinner';
import Image from 'next/image';

import { CARD_CLASS } from 'common-util/classes';
import { formatDate } from 'common-util/formatDate';

interface VideoProps {
  video: unknown;
}

const Video = ({ video }: VideoProps) => (
  <a
    href={
      // @ts-expect-error TS(2339) FIXME: Property 'platform_link' does not exist on type 'u... Remove this comment to see the full error message
      video.platform_link ||
      // @ts-expect-error TS(2339) FIXME: Property 'drive_link' does not exist on type 'unkn... Remove this comment to see the full error message
      video.drive_link ||
      // @ts-expect-error TS(2339) FIXME: Property 'video_url' does not exist on type 'unkno... Remove this comment to see the full error message
      video.video_url ||
      // @ts-expect-error TS(2339) FIXME: Property 'apple_link' does not exist on type 'unkn... Remove this comment to see the full error message
      video.apple_link ||
      // @ts-expect-error TS(2339) FIXME: Property 'spotify_link' does not exist on type 'un... Remove this comment to see the full error message
      video.spotify_link ||
      // @ts-expect-error TS(2339) FIXME: Property 'rss_link' does not exist on type 'unknow... Remove this comment to see the full error message
      video.rss_link
    }
    target="_blank"
    rel="noopener noreferrer"
  >
    <div
      className={`${CARD_CLASS} max-w-full h-full overflow-hidden min-h-[300px] `}
    >
      {/* @ts-expect-error TS(2339) FIXME: Property 'imageFilename' does not exist on type 'u... Remove this comment to see the full error message */}
      {video.imageFilename && (
        <Image
          // @ts-expect-error TS(2339) FIXME: Property 'imageFilename' does not exist on type 'u... Remove this comment to see the full error message
          src={`${video.imageFilename}`}
          // @ts-expect-error TS(2339) FIXME: Property 'title' does not exist on type 'unknown'.
          alt={video.title}
          width={750}
          height={200}
          className="rounded-t-lg"
        />
      )}
      <div className="p-6 flex flex-col h-full">
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 truncate whitespace-normal min-h-[70px]">
          {/* @ts-expect-error TS(2339) FIXME: Property 'title' does not exist on type 'unknown'. */}
          {video.title}
        </h2>
        <div className="text-gray-500 mt-auto">
          <span className="text-sm md:text-xl lg:text-sm">
            {/* @ts-expect-error TS(2339) FIXME: Property 'date' does not exist on type 'unknown'. */}
            {formatDate(video.date)}
          </span>
        </div>
      </div>
    </div>
  </a>
);

interface VideosProps {
  isLoading?: boolean;
  videos?: unknown[];
  limit?: number;
}

export const Videos = ({
  isLoading,
  videos,
  limit,
  // @ts-expect-error TS(2339) FIXME: Property 'isMain' does not exist on type 'VideosPr... Remove this comment to see the full error message
  isMain,
}: VideosProps) => (
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
            // @ts-expect-error TS(2339) FIXME: Property 'id' does not exist on type 'unknown'.
            <div key={video.id}>
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
