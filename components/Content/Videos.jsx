import { useMemo } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Video from './Video';

export const Videos = ({ videos, limit }) => {
  const videosSortedByDate = useMemo(
    () => videos.sort((a, b) => new Date(b.date) - new Date(a.date)),
    [],
  );

  console.log(videos);

  return (
    <section>
      <div>
        <div>
          <h2 className="mb-4 text-3xl md:text-5xl lg:text-4xl tracking-tight font-extrabold text-gray-900 ">
            Videos & Podcasts
          </h2>

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

        <div className="grid gap-8 lg:grid-cols-3">
          {(limit
            ? videosSortedByDate.slice(0, limit)
            : videosSortedByDate
          ).map((video) => (
            <div key={video.platform_link}>
              <Video video={video} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

Videos.propTypes = {
  // videos: PropTypes.array(),
  limit: PropTypes.number,
};
Videos.defaultProps = {
  //  videos: [],
  limit: null,
};

export default Videos;
