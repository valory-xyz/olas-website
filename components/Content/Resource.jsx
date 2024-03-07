import PropTypes from 'prop-types';

const Resource = ({ resource }) => (
  <a href={resource.url} target="_blank" rel="noopener noreferrer">
    <article className="p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4" />
      </div>
      <div className="min-h-[100px]">
        <h2 className="mb-2 text-2xl md:text-4xl lg:text-2xl font-bold tracking-tight text-gray-900 ">
          {resource.title}
        </h2>
        <div className="text-base md:text-2xl lg:text-xl mb-4 text-gray-600">{resource.description}</div>
      </div>
    </article>
  </a>
);

Resource.propTypes = {
  resource: PropTypes.shape({
    description: PropTypes.string,
    title: PropTypes.string,
    url: PropTypes.string,
  }).isRequired,
};

export default Resource;
