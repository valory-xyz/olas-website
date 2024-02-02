import Image from "next/image";

const Video = ({ video }) => {
  return (
    <a
      href={video.platform_link || video.drive_link}
      target="_blank"
      rel="noopener noreferrer"
    >
      <article class="bg-white rounded-lg border border-gray-200 shadow-md  hover:shadow-lg max-w-full min-h-[400px] flex flex-col justify-between">
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
          <h2 class="mb-2 text-2xl md:text-4xl lg:text-2xl font-bold tracking-tight text-gray-900 truncate whitespace-normal">
            {video.title}
          </h2>
          <div class="flex justify-between items-center text-gray-500">
            <span class="text-sm md:text-xl lg:text-sm">{video.date}</span>
          </div>
        </div>
      </article>
    </a>
  );
};

export default Video;
