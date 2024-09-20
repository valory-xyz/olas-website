import { useMemo } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { isNaN } from 'lodash';

import videos from 'data/videos.json';
import Video from './Video';

const Videos = ({ limit }) => {
  const videosSortedByDate = useMemo(
    () =>
      [...videos].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        const isValidDateA = !isNaN(dateA.getTime());
        const isValidDateB = !isNaN(dateB.getTime());

        if (isValidDateA && isValidDateB) return dateB - dateA;
        if (isValidDateA) return -1;
        if (isValidDateB) return 1;
        return 0;
      }),
    [videos],
  );

  return (
    <section>
      <div>
        <div>
          <h2 className="mb-4 text-3xl lg:text-5xl tracking-tight font-extrabold text-gray-900 ">
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

Videos.propTypes = { limit: PropTypes.number };
Videos.defaultProps = { limit: null };

export default Videos;
