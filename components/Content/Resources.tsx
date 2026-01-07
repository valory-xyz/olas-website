import Link from 'next/link';
import resources from 'data/resources.json';
import Resource from './Resource';

interface ResourcesProps {
  limit?: number;
  tagFilter?: string;
}

const Resources = ({ limit = null, tagFilter = null }: ResourcesProps) => {
  const sortedResources = resources.sort(
    // @ts-expect-error TS(2362) FIXME: The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  let newResources = [];

  if (tagFilter) {
    newResources = sortedResources.filter((article) =>
      article?.tags.includes(tagFilter),
    );
  } else {
    newResources = sortedResources;
  }

  return (
    <div>
      <div>
        <h2 className="mb-4 text-3xl lg:text-5xl tracking-tight font-extrabold text-gray-900 ">
          Resources
        </h2>
        {limit !== null && newResources.length > limit && (
          <div className="mb-4">
            <Link
              href="/resources"
              className="text-xl lg:text-2xl text-primary hover:text-primary-800 transition-colors duration-300"
            >
              See all ▶
            </Link>
          </div>
        )}
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        {(limit ? newResources.slice(0, limit) : newResources).map(
          (resource) => (
            <div key={resource.platform_link}>
              <Resource resource={resource} />
            </div>
          ),
        )}
      </div>
    </div>
  );
};

Resources.defaultProps = {
  limit: null,
  tagFilter: null,
};

export default Resources;
