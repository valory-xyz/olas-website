import { useEffect, useState } from 'react';

import { getEducationArticles } from 'common-util/api';
import Article from 'components/Content/Article';

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
    <div className="section rounded-lg" id="quick-intro-articles">
      <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl">
        Quick intro articles
      </h2>

      <div className="grid gap-6 md:grid-cols-3 md:gap-8 mt-8">
        {educationArticles?.map((article) => (
          <Article key={article.id} article={article} showReadTime />
        ))}
      </div>
    </div>
  );
};
