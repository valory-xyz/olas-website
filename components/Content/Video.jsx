import { CARD_CLASS } from 'common-util/classes';
import Image from 'next/image';
import PropTypes from 'prop-types';

const Video = ({ video }) => (
  <a
    href={video.platform_link || video.drive_link}
    target="_blank"
    rel="noopener noreferrer"
  >
    <article
      className={`${CARD_CLASS} max-w-full h-full overflow-hidden min-h-[300px] `}
    >
      {video.imageFilename && (
        <Image
          src={`/images/videos/${video.imageFilename}`}
          alt={video.title}
          width="750"
          height="200"
          className="rounded-t-lg"
        />
      )}
      <div className="p-6 flex flex-col h-full">
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 truncate whitespace-normal min-h-[70px]">
          {video.title}
        </h2>
        <div className="text-gray-500 mt-auto">
          <span className="text-sm md:text-xl lg:text-sm">{video.date}</span>
        </div>
      </div>
    </article>
  </a>
);

Video.propTypes = {
  video: PropTypes.shape({
    date: PropTypes.string,
    drive_link: PropTypes.string,
    imageFilename: PropTypes.string,
    platform_link: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
};

export default Video;
