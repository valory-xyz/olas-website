import Article from "./Article";
import articles from "@/data/articles.json";
import Link from "next/link";

const Articles = ({ limit = null }) => {
  const sortedArticles = articles.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
  
  return (
    <section>
      <div>
        <div>
        <h2 className="mb-4 text-3xl md:text-5xl lg:text-4xl tracking-tight font-extrabold text-gray-900 ">
            Articles
          </h2>
          {limit !== null && (
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
          {(limit ? articles.slice(0, limit) : articles).map((article) => (
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
