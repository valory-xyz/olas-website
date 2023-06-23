const Resource = ({ resource }) => {
  return (
    <a href={resource.url} target="_blank" rel="noopener noreferrer">
      <article class="p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-4">
          </div>
        </div>
        <div className="min-h-[90px]">
          <h2 class="mb-2 text-2xl md:text-4xl lg:text-2xl font-bold tracking-tight text-gray-900 ">
            {resource.title}
          </h2>
          <div className="text-base md:text-2xl lg:text-sm mb-4 text-gray-600">{resource.description}</div>
        </div>
      </article>
    </a>
  );
};

export default Resource;
