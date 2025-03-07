import Link from 'next/link';
import PropTypes from 'prop-types';

import { VideoPropTypes } from 'common-util/propTypes';
import { Spinner } from 'components/Spinner';
import Image from 'next/image';

import { CARD_CLASS } from 'common-util/classes';
import { formatDate } from 'common-util/formatDate';

const Video = ({ video }) => (
  <a
    href={video.platform_link || video.drive_link || video.video_url}
    target="_blank"
    rel="noopener noreferrer"
  >
    <div
      className={`${CARD_CLASS} max-w-full h-full overflow-hidden min-h-[300px] `}
    >
      {video.imageFilename && (
        <Image
          src={`${video.imageFilename}`}
          alt={video.title}
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
            {formatDate(video.date)}
          </span>
        </div>
      </div>
    </div>
  </a>
);

Video.propTypes = {
  video: VideoPropTypes.isRequired,
};

export const Videos = ({ isLoading, videos, limit }) => (
  <section>
    <div>
      <div>
        <h1 className="mb-4 text-3xl lg:text-5xl tracking-tight font-extrabold text-gray-900 ">
          Videos & Podcasts
        </h1>

        {limit !== null && (
          <div className="mb-4">
            <Link
              href="/videos"
              className="text-xl md:text-2xl text-primary hover:text-primary-800 transition-colors duration-300"
            >
              See all ▶
            </Link>
          </div>
        )}
      </div>

      {isLoading ? (
        <Spinner customClass="h-auto py-20" />
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <div key={video.id}>
              <Video video={video} />
            </div>
          ))}
        </div>
      )}
    </div>
  </section>
);

Videos.propTypes = {
  isLoading: PropTypes.bool,
  videos: PropTypes.arrayOf(VideoPropTypes),
  limit: PropTypes.number,
};

Videos.defaultProps = {
  isLoading: true,
  videos: [],
  limit: null,
};

export default Videos;
