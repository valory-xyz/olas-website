import Image from "next/image";

const imageDomain = "https://cms-backend.autonolas.tech";
const articleDomain = "https://autonolas.network/blog/";

const Article = ({ article }) => {
  const { title, subtitle, datePublished, slug } = article.attributes;
  const { url, width, height } =
    article?.attributes?.headerImage?.data[0]?.attributes?.formats?.large || {};

  return (
    <a
      href={`${articleDomain}${slug}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <article class="bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg flex flex-col justify-between">
        {(url || width || height) && (
          <div>
            <Image
              src={imageDomain + url}
              width={width}
              height={height}
              alt={article.title}
              className="rounded-t-lg h-[200px] object-cover"
            />
          </div>
        )}
        <div className="p-6 min-h-[150px]">
          <h2 class="mb-2 text-2xl md:text-4xl lg:text-2xl font-bold tracking-tight text-gray-900 truncate whitespace-normal line-clamp-2">
            {title}
          </h2>
          <span class="text-sm md:text-2xl lg:text-sm text-gray-600">
            {datePublished}
          </span>
        </div>
      </article>
    </a>
  );
};

export default Article;
