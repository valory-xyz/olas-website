import PropTypes from 'prop-types';
import qs from 'qs';
import useSWR from 'swr';

import { Spinner } from '../Spinner';
import Article from './Article';

const URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;
const subURL = 'blog-posts';
const fetcher = (...args) => fetch(...args).then((res) => res.json());

export const Updates = ({ limit }) => {
  const params = {
    sort: ['datePublished:desc'],
    populate: '*',
    'pagination[limit]': limit,
    filters: {
      id: { $gte: 80, $lte: 86 },
    },
  };

  const { data, isLoading } = useSWR(
    `${URL}/${subURL}${params ? '?' : ''}${qs.stringify(params)}`,
    fetcher,
  );

  const blogItems = data?.data ?? [];

  if (isLoading) return <Spinner />;

  return (
    <section>
      <div>
        <h2 className="mb-8 text-3xl lg:text-5xl tracking-tight font-extrabold text-gray-900 ">
          Quarterly updates
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {(limit ? blogItems.slice(0, limit) : blogItems).map((blogItem) => (
            <Article
              key={blogItem.id}
              article={blogItem}
              href={`/blog/${blogItem?.attributes?.slug}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

Updates.propTypes = {
  limit: PropTypes.number,
};
Updates.defaultProps = {
  limit: 1000,
};
