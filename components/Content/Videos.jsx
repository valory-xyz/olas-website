import Link from 'next/link';
import PropTypes from 'prop-types';

import { Spinner } from 'components/Spinner';
import { VideoPropTypes } from 'common-util/propTypes';
import { Video } from './Video';

export const Videos = ({ isLoading, videos, limit }) => (
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

      {isLoading ? <Spinner customClass="h-auto py-20" /> : (
        <div className="grid gap-8 lg:grid-cols-3 ">
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
