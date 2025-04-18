import { isArray } from 'lodash';
import Image from 'next/image';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';

import { CARD_CLASS } from 'common-util/classes';
import { formatDate } from 'common-util/formatDate';

const imageDomain = process.env.NEXT_PUBLIC_API_URL;

const Article = ({ article, href, showReadTime, showDate }) => {
  const [imageError, setImageError] = useState(false);

  const image = useMemo(() => {
    const imageData = article?.attributes?.headerImage?.data;
    const data = isArray(imageData) ? imageData?.[0] : imageData;

    if (!data) return null;

    return data?.attributes?.formats?.large;
  }, [article]);

  const {
    title,
    datePublished: unFormattedDatePublished,
    readTime,
  } = article.attributes;
  const { url, width, height } = image || {};
  const datePublished = formatDate(unFormattedDatePublished);

  const moreInfo = useMemo(() => {
    const moreInfoArray = [];

    if (showDate && datePublished) {
      moreInfoArray.push(datePublished);
    }

    if (showReadTime && readTime) {
      moreInfoArray.push(`${readTime} ${readTime === 1 ? 'MIN' : 'MINS'} READ`);
    }

    return moreInfoArray.join(' • ');
  }, [showDate, datePublished, showReadTime, readTime]);

  return (
    <Link href={href}>
      <article
        className={`${CARD_CLASS} h-full overflow-hidden border-t border-[#0000000d]`}
      >
        {!imageError && (url || width || height) ? (
          <div className="flex h-full">
            <Image
              src={imageDomain + url}
              width={width}
              height={height}
              alt={article.attributes.title}
              className="rounded-t-lg py-auto object-cover"
              onError={() => {
                setImageError(true);
              }}
            />
          </div>
        ) : (
          <div className="bg-gray-100 text-gray-500 min-h-[200px]" />
        )}

        <div className="p-6 min-h-[150px]">
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 truncate whitespace-normal line-clamp-2 min-h-[70px]">
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
