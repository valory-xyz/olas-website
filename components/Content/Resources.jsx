import PropTypes from 'prop-types';
import Link from 'next/link';
import resources from 'data/resources.json';
import Resource from './Resource';

const Resources = ({ limit = null, tagFilter = null }) => {
  const sortedResources = resources.sort((a, b) => new Date(b.date) - new Date(a.date));

  let newResources = [];

  if (tagFilter) {
    newResources = sortedResources.filter((article) => article?.tags.includes(tagFilter));
  } else {
    newResources = sortedResources;
  }

  return (
    <div>
      <div>
        <h2 className="mb-4 text-3xl md:text-5xl lg:text-4xl tracking-tight font-extrabold text-gray-900 ">
          Resources
        </h2>
        {(limit !== null && newResources.length > limit) && (
          <div className="mb-4">
            <Link
              href="/resources"
              className="text-xl md:text-2xl text-primary hover:text-primary-800 transition-colors duration-300"
            >
              See all ▶
            </Link>
          </div>
        )}
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        {(limit ? newResources.slice(0, limit) : newResources).map((resource) => (
          <div key={resource.platform_link}>
            <Resource resource={resource} />
          </div>
        ))}
      </div>
    </div>
  );
};

Resources.propTypes = {
  limit: PropTypes.number,
  tagFilter: PropTypes.string,
};
Resources.defaultProps = {
  limit: null,
  tagFilter: null,
};

export default Resources;
