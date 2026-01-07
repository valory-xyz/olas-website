import qs from 'qs';
import useSWR from 'swr';

import { Spinner } from '../Spinner';
import Article from './Article';

const URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;
const subURL = 'blog-posts';

// @ts-expect-error TS(2556) FIXME: A spread argument must either have a tuple type or... Remove this comment to see the full error message
const fetcher = (...args) => fetch(...args).then((res) => res.json());

const CASE_STUDIES_FUNNEL_ID = 9;

interface CaseStudiesProps {
  limit?: number;
}

export const CaseStudies = ({ limit }: CaseStudiesProps) => {
  const params = {
    sort: ['datePublished:desc'],
    populate: '*',
    'pagination[limit]': limit,
    filters: {
      funnel: {
        id: { $eq: CASE_STUDIES_FUNNEL_ID },
      },
    },
  };

  const { data, isLoading } = useSWR(
    `${URL}/${subURL}${params ? '?' : ''}${qs.stringify(params)}`,
    fetcher,
  );

  const caseStudies = data?.data ?? [];

  if (isLoading) return <Spinner />;

  return (
    <section>
      <div>
        <h1 className="mb-8 text-3xl lg:text-5xl tracking-tight font-extrabold text-gray-900 ">
          Case Studies
        </h1>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {(limit ? caseStudies.slice(0, limit) : caseStudies).map((item) => (
            <Article
              key={item.id}
              article={item}
              href={`/blog/${item?.attributes?.slug}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

CaseStudies.defaultProps = {
  limit: 1000,
};
