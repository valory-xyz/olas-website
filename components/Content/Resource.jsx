const Resource = ({ resource }) => {
  return (
    <a href={resource.url} target="_blank" rel="noopener noreferrer">
      <article class="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-4">
            {/* <img class="w-7 h-7 rounded-full" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png" alt="Jese Leos avatar" /> */}
          </div>
        </div>
        <div className="min-h-[90px]">
          <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {resource.title}
          </h2>
          <div className="text-base text-gray-600">{resource.description}</div>
        </div>
      </article>
    </a>
  );
};

export default Resource;
