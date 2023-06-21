const Video = ({ video }) => {
  return (
    <article class="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-4">
          {/* <img class="w-7 h-7 rounded-full" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png" alt="Jese Leos avatar" /> */}
        </div>
      </div>
      <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        <a href={video.platform_link || video.drive_link} target="_blank" rel="noopener noreferrer">{video.title}</a>
      </h2>
      <div class="flex justify-between items-center text-gray-500">
        <span class="text-sm">{video.date}</span>
      </div>
    </article>
  );
};

export default Video;
