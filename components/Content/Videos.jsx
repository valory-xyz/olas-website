import { useMemo } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { isNaN } from 'lodash';

import videos from 'data/videos.json';
import Video from './Video';

const Videos = ({ limit }) => {
  const videosSortedByDate = useMemo(() => {
    const sortedVideos = [...videos];

    function isDate(date) {
      // Check if the input is a valid date string or object
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    }

    // Separate valid dates and non-dates
    const validDates = sortedVideos.filter((video) => isDate(new Date(video.date)));
    const nonDates = sortedVideos.filter(
      (video) => !isDate(new Date(video.date)),
    );

    // Sort the valid dates
    validDates.sort((a, b) => new Date(b.date) - new Date(a.date));

    return [...validDates, ...nonDates];
  }, [videos]);

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

Videos.propTypes = { limit: PropTypes.number };
Videos.defaultProps = { limit: null };

export default Videos;
