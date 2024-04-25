import PropTypes from 'prop-types';
import Link from 'next/link';
import qs from 'qs';

import useSWR from 'swr';
import Article from './Article';
import { Spinner } from '../Spinner';

export const URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;
const subURL = 'blog-posts';
export const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Articles = ({ limit, showSeeAll }) => {
  const params = {
    sort: ['datePublished:desc'],
    populate: '*',
    'pagination[limit]': limit,
  };
  const stringifyParams = qs.stringify(params);

  const { data, isLoading } = useSWR(`${URL}/${subURL}${params ? '?' : ''}${stringifyParams}`, fetcher);

  const blogItems = data?.data ?? [];

  if (isLoading) return <Spinner />;

  return (
    <section>
      <div>
        <div>
          <h2 className="mb-4 text-3xl md:text-5xl lg:text-4xl tracking-tight font-extrabold text-gray-900 ">
            Blog
          </h2>
          {showSeeAll && (
            <div className="mb-4">
              <Link
                href="/blog"
                className="text-xl md:text-2xl text-primary hover:text-primary-800 transition-colors duration-300"
              >
                See all ▶
              </Link>
            </div>
          )}
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          {(limit ? blogItems.slice(0, limit) : blogItems).map((blogItem) => (
            <Article article={blogItem} key={blogItem.id} />
          ))}
        </div>
      </div>
    </section>
  );
};

Articles.propTypes = {
  limit: PropTypes.number,
  showSeeAll: PropTypes.bool,
};
Articles.defaultProps = {
  limit: 1000,
  showSeeAll: false,
};

export default Articles;
