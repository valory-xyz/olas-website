import Article from "./Article";
import articles from "@/data/articles.json";
import Link from "next/link";

const Articles = ({ limit = null, tagFilter = null }) => {
  let sortedArticles = articles.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  let newArticles = []

  if (tagFilter) {
    newArticles = sortedArticles.filter(article => { 
      return article?.attributes.tags.includes(tagFilter)})
  } else {
    newArticles = sortedArticles
  }
  
  return (
    <section>
      <div>
        <div>
        <h2 className="mb-4 text-3xl md:text-5xl lg:text-4xl tracking-tight font-extrabold text-gray-900 ">
            Articles
          </h2>
          {(limit !== null && newArticles.length > limit) && (
            <div className="mb-4">
              <Link
                href="/articles"
                className="text-xl md:text-2xl text-primary hover:text-primary-800 transition-colors duration-300"
              >
                See all ▶
              </Link>
            </div>
          )}
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          {(limit ? newArticles.slice(0, limit) : newArticles).map((article) => (
            <div key={article.platform_link}>
              <Article article={article} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Articles;
