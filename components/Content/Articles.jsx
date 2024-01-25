import Article from "./Article";
import Link from "next/link";
import qs from 'qs';

import useSWR from "swr";

export const URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;
const subURL = 'blog-posts';
export const fetcher = (...args) => fetch(...args).then(res => res.json());

const Articles = ({ limit = 1000, tagFilter = null, showSeeAll = false }) => {
  const params = {
    sort: ['datePublished:desc'],
    populate: '*',
    'pagination[limit]': limit,
  };
  const stringifyParams = qs.stringify(params);

  const {data, error, isLoading} = useSWR(`${URL}/${subURL}${params ? '?' : ''}${stringifyParams}`, fetcher);

  const blogItems = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0H4z"></path>
        </svg>
      </div>
    );
  }
  
  return (
    <section>
      <div>
        <div>
        <h2 className="mb-4 text-3xl md:text-5xl lg:text-4xl tracking-tight font-extrabold text-gray-900 ">
            Articles
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
            <div key={blogItem.platform_link}>
              <Article article={blogItem} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Articles;
