import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const imageDomain = process.env.NEXT_PUBLIC_API_URL;

const Article = ({ article }) => {
  const [imageError, setImageError] = useState(false);

  const {
    title, subtitle, datePublished, slug,
  } = article.attributes;
  const image = article?.attributes?.headerImage?.data[0]?.attributes?.formats?.large;
  const { url, width, height } = image || {};

  return (
    <Link href={`/blog/${slug}`}>
      <article className="bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg flex flex-col justify-between">
        {!imageError && (url || width || height) && (
          <Image
            src={imageDomain + url}
            width={width}
            height={height}
            alt={article.title}
            className="rounded-t-lg h-[200px] object-cover"
            onError={() => {
              setImageError(true);
            }}
          />
        )}
        <div className="p-6 min-h-[150px]">
          <h2 className="mb-2 text-2xl md:text-4xl lg:text-2xl font-bold tracking-tight text-gray-900 truncate whitespace-normal line-clamp-2">
            {title}
          </h2>
          <span className="text-sm md:text-2xl lg:text-sm text-gray-600">
            {datePublished}
          </span>
        </div>
      </article>
    </Link>
  );
};

export default Article;
