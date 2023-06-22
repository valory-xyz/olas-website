import Image from "next/image";

const imageDomain = "https://cms-backend.autonolas.tech";
const articleDomain = "https://autonolas.network/blog/";

const Article = ({ article }) => {
  const { title, subtitle, datePublished, slug } =
    article.attributes;
  const { url, width, height } =
  article?.attributes?.headerImage?.data[0]?.attributes?.formats?.large || {};

  return (
        <a
          href={`${articleDomain}${slug}`}
          target="_blank"
          rel="noopener noreferrer"
        >
    <article class="bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg">
      <div>
      <Image
        src={imageDomain + url}
        width={500}
        height={(width/500) * height}
        alt={article.title}
        className="rounded-t-lg"
      />
      </div>
      <div className="p-6">
          <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h2>
          <div className="text-base mb-2 text-gray-600">{subtitle}</div>
        <div class="flex justify-between items-center text-gray-500">
          <span class="text-sm">{datePublished}</span>
        </div>
      </div>
    </article>
        </a>
  );
};

export default Article;
