import PropTypes from 'prop-types';
import Image from 'next/image';

const Video = ({ video }) => (
  <a
    href={video.platform_link || video.drive_link}
    target="_blank"
    rel="noopener noreferrer"
  >
    <article className="bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg max-w-full min-h-[400px] flex flex-col justify-between">
      {video.imageFilename && (
        <Image
          src={`/images/videos/${video.imageFilename}`}
          alt={video.title}
          width="750"
          height="200"
          className="rounded-t-lg"
        />
      )}
      <div className="p-6">
        <h2 className="mb-2 text-2xl md:text-4xl lg:text-2xl font-bold tracking-tight text-gray-900 truncate whitespace-normal">
          {video.title}
        </h2>
        <div className="flex justify-between items-center text-gray-500">
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
