type ResourceProps = {
  resource: {
    description?: string;
    title?: string;
    url?: string;
  };
};

const Resource = ({ resource }: ResourceProps) => (
  <a href={resource.url} target="_blank" rel="noopener noreferrer">
    <article className="p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4" />
      </div>
      <div className="min-h-[100px]">
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">
          {resource.title}
        </h2>
        <div className="text-base md:text-xl mb-4 text-gray-600">
          {resource.description}
        </div>
      </div>
    </article>
  </a>
);

export default Resource;
