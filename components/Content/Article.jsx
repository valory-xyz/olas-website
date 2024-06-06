import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import Link from 'next/link';
import { isArray } from 'lodash';

import { CARD_CLASS } from 'common-util/classes';

const imageDomain = process.env.NEXT_PUBLIC_API_URL;

const Article = ({
  article, href, showReadTime, showDate,
}) => {
  const [imageError, setImageError] = useState(false);

  const image = useMemo(() => {
    const imageData = article?.attributes?.headerImage?.data;
    const data = isArray(imageData) ? imageData?.[0] : imageData;

    if (!data) return null;

    return data?.attributes?.formats?.large;
  }, [article]);

  const { title, datePublished, readTime } = article.attributes;
  const { url, width, height } = image || {};

  const moreInfo = useMemo(() => {
    const moreInfoArray = [];

    if (showDate && datePublished) {
      moreInfoArray.push(datePublished);
    }

    if (showReadTime && readTime) {
      moreInfoArray.push(`${readTime} ${readTime === 1 ? 'MIN' : 'MINS'} READ`);
    }

    return moreInfoArray.join(' • ');
  }, [article, showReadTime, showDate]);

  return (
    <Link href={href}>
      <article className={CARD_CLASS}>
        {!imageError && (url || width || height) ? (
          <Image
            src={imageDomain + url}
            width={width}
            height={height}
            alt={article.attributes.title}
            className="rounded-t-lg object-cover"
            onError={() => {
              setImageError(true);
            }}
          />
        ) : (
          <div style={{ height: 200 }} className="bg-gray-100 text-gray-500" />
        )}

        <div className="p-6 min-h-[150px]">
          <h2 className="mb-2 text-2xl md:text-4xl lg:text-2xl font-bold tracking-tight text-gray-900 truncate whitespace-normal line-clamp-2 min-h-[70px]">
            {title}
          </h2>

          {moreInfo && (
            <span className="text-sm md:text-2xl lg:text-sm text-gray-600">
              {moreInfo}
            </span>
          )}
        </div>
      </article>
    </Link>
  );
};

Article.propTypes = {
  article: PropTypes.shape({
    attributes: PropTypes.shape({
      datePublished: PropTypes.string,
      headerImage: PropTypes.object,
      slug: PropTypes.string,
      title: PropTypes.string,
      readTime: PropTypes.number,
    }),
  }).isRequired,
  href: PropTypes.string.isRequired,
  showReadTime: PropTypes.bool,
  showDate: PropTypes.bool,
};

Article.defaultProps = {
  showReadTime: false,
  showDate: true,
};

export default Article;
