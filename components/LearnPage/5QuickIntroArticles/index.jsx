import PropTypes from 'prop-types';
import get from 'lodash/get';
import Link from 'next/link';

import { getEducationArticles } from '@/common-util/api';
import { useEffect, useState } from 'react';

const QuickIntroArticles = () => {
  const [educationArticles, setEducationArticles] = useState([]);

  useEffect(() => {
    const fetchEducationArticles = async () => {
      const articles = await getEducationArticles();
      setEducationArticles(articles);
    };

    fetchEducationArticles();
  }, []);

  return (
  <div className="section" id="quick-intro-articles">
    <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl">Quick intro articles</h2>
    <div className="flex justify-end">
      <Link href="/education-articles" className="text-blue-600 hover:text-blue-800 visited:text-purple-600" legacyBehavior>
        See all education articles
      </Link>
    </div>

    <div className="grid gap-6 md:grid-cols-3 md:gap-8 mt-8">
      {educationArticles?.map(({ id, attributes }) => {
        const { headerImage, title, readTime } = attributes || {};
        const imageUrl = get(headerImage, 'data.attributes.url') || '';

        return (
          <div key={`articles-${id}`}>
            <Link href={`/learn/education-articles/${id}`} legacyBehavior>
              <a className="column">
                <div
                  className="w-full h-64 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${process.env.NEXT_PUBLIC_API_URL}${imageUrl})`,
                  }}
                />
                <h3 className="text-2xl font-bold mt-4">{title}</h3>
                <p className="text-gray-500">
                  {readTime}
                    &nbsp;
                  {readTime === 1 ? 'MIN' : 'MINS'}
                    &nbsp; READ
                </p>
              </a>
            </Link>
          </div>
        );
      })}
    </div>
  </div>
)};

QuickIntroArticles.propTypes = {
  educationArticles: PropTypes.instanceOf(Array).isRequired,
};

export default QuickIntroArticles;
