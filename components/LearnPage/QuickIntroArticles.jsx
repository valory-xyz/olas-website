import { useEffect, useState } from 'react';

import { getEducationArticles } from 'common-util/api';
import { SCREEN_WIDTH_XL, SUB_HEADER_CLASS } from 'common-util/classes';
import Article from 'components/Content/Article';
import SectionWrapper from 'components/Layout/SectionWrapper';

export const QuickIntroArticles = () => {
  const [educationArticles, setEducationArticles] = useState([]);

  useEffect(() => {
    const fetchEducationArticles = async () => {
      const articles = await getEducationArticles();
      setEducationArticles(articles);
    };

    fetchEducationArticles();
  }, []);

  return (
    <SectionWrapper
      customClasses="lg:p-24 px-4 py-12 border-b"
      backgroundType="SUBTLE_GRADIENT"
    >
      <div className={`${SCREEN_WIDTH_XL} gap-5`}>
        <div className="section rounded-lg" id="quick-intro-articles">
          <h2 className={`${SUB_HEADER_CLASS} text-center`}>
            Quick Intro Articles
          </h2>

          <div className="grid gap-6 md:grid-cols-3 md:gap-8 mt-8">
            {educationArticles?.map((article) => (
              <Article
                key={article.id}
                showReadTime
                article={article}
                href={`/learn/education-articles/${article.id}`}
              />
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};
