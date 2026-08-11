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

/**
 * Strapi caps a page at 100 entries whatever `pagination[limit]` asks for, so a
 * single request for 1000 silently returns the first 100 and the rest of the
 * blog simply never appears. Anything above the cap has to be paged through.
 *
 * Keep in sync with the equivalent paging in `next-sitemap.config.js`, which
 * hits the same endpoint for the same reason.
 */
const STRAPI_MAX_PAGE_SIZE = 100;

const fetcher = async ([url, maxPages]: [string, number]) => {
  const first = await fetch(url).then((res) => res.json());

  // `maxPages` keeps a small caller honest: the homepage asks for 3 posts, so
  // it must not walk the whole archive just because more pages exist.
  const pageCount = Math.min(first?.meta?.pagination?.pageCount ?? 1, maxPages);
  if (pageCount <= 1) return first;

  const rest = await Promise.all(
    // Pages are 1-indexed and page 1 is already fetched.
    Array.from({ length: pageCount - 1 }, (_, index) =>
      fetch(`${url}&pagination[page]=${index + 2}`).then((res) => res.json())
    )
  );

  return {
    ...first,
    data: [...(first?.data ?? []), ...rest.flatMap((page) => page?.data ?? [])],
  };
};

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

const Articles = ({ limit = 1000, showSeeAll = false, displayFolders, isMain }) => {
  const params = {
    sort: ['datePublished:desc'],
    populate: '*',
    // `pageSize`, not `limit`: `limit` is silently clamped to the cap above and
    // gives no `pageCount` to page through with.
    'pagination[pageSize]': Math.min(limit, STRAPI_MAX_PAGE_SIZE),
  };
  const stringifyParams = qs.stringify(params);
  const pageSize = Math.min(limit, STRAPI_MAX_PAGE_SIZE);
  const maxPages = Math.ceil(limit / pageSize);

  const { data, isLoading } = useSWR(
    [`${API_URL}/${subURL}${params ? '?' : ''}${stringifyParams}`, maxPages],
    fetcher
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
                        <span className="font-medium my-auto ml-3">{folder.label}</span>
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
            <Article key={blogItem.id} article={blogItem} href={`/blog/${blogItem?.slug}`} />
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

export default Articles;
