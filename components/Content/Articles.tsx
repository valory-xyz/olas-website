import Link from 'next/link';
import PropTypes from 'prop-types';
import qs from 'qs';

import { TITLE_CLASS } from 'common-util/classes';
import { Card } from 'components/ui/card';
import { ChevronRight, FolderClosed } from 'lucide-react';
import useSWR from 'swr';
import { Spinner } from '../Spinner';
import Article from './Article';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;
const subURL = 'blog-posts';

// @ts-expect-error TS(2556) FIXME: A spread argument must either have a tuple type or... Remove this comment to see the full error message
const fetcher = (...args) => fetch(...args).then((res) => res.json());

const folders = [
  {
    label: 'Quarterly Updates',
    link: '/quarterly-updates',
  },
  {
    label: 'Case Studies',
    link: '/case-studies',
  },
];

const Articles = ({ limit, showSeeAll, displayFolders, isMain }) => {
  const params = {
    sort: ['datePublished:desc'],
    populate: '*',
    'pagination[limit]': limit,
  };
  const stringifyParams = qs.stringify(params);

  const { data, isLoading } = useSWR(
    `${API_URL}/${subURL}${params ? '?' : ''}${stringifyParams}`,
    fetcher,
  );

  const blogItems = data?.data ?? [];

  if (isLoading) return <Spinner />;

  return (
    <section>
      <div>
        <div>
          {isMain ? '' : <h2 className={`${TITLE_CLASS} mb-6`}>Blog</h2>}

          {displayFolders && (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 my-8">
                {folders.map((folder) => (
                  <Link key={folder.label} href={folder.link}>
                    <Card className="flex p-3 gap-2 justify-between items-center">
                      <div className="flex">
                        <div className="p-3 bg-purple-100 rounded-lg">
                          <FolderClosed color="#B972E8" />
                        </div>
                        <span className="font-medium my-auto ml-3">
                          {folder.label}
                        </span>
                      </div>
                      <ChevronRight />
                    </Card>
                  </Link>
                ))}
              </div>
              <h3 className="text-2xl font-semibold mb-4">All posts</h3>
            </>
          )}

          {showSeeAll && (
            <div className="mb-4">
              <Link
                href="/blog"
                className="text-xl text-purple-700 hover:text-purple-800 transition-colors duration-300"
              >
                See all
              </Link>
            </div>
          )}
        </div>

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

Articles.propTypes = {
  limit: PropTypes.number,
  showSeeAll: PropTypes.bool,
};
Articles.defaultProps = {
  limit: 1000,
  showSeeAll: false,
};

export default Articles;
