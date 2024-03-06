import { useRouter } from 'next/router';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import PageWrapper from '@/components/Layout/PageWrapper';
import { getBlog } from '@/common-util/api';
import { TEXT, TITLE, markdownComponents } from '@/styles/globals';
import Meta from '@/components/Meta';
import { Spinner } from '@/components/Spinner';

const BlogItem = () => {
  const router = useRouter();
  const { id } = router.query;
  const [blogItem, setBlogItem] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (id) {
      getBlog(id).then(setBlogItem);
    }
  }, [id]);

  if (!blogItem) return <Spinner />;

  const {
    title, datePublished, body: content, headerImage,
  } = blogItem.attributes;
  const imagePath = headerImage?.data?.[0]?.attributes?.formats?.large?.url;
  const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}${imagePath}`;

  return (
    <PageWrapper>
      <Meta pageTitle={title} siteImageUrl={imageUrl} />
      <div className="max-w-3xl mx-auto p-4">
        {!imageError && (
          <Image
            src={imageUrl}
            width={headerImage.data[0].attributes.formats.large.width}
            height={headerImage.data[0].attributes.formats.large.height}
            alt={title}
            className="border mb-4 rounded-lg"
            onError={() => {
              setImageError(true);
            }}
          />
        )}
        <div className={`${TITLE.SMALL} mb-4`}>{title}</div>
        <div className={`${TEXT} mb-4`}>{datePublished}</div>
        <Markdown
          className={TEXT}
          components={markdownComponents}
        >
          {content}
        </Markdown>
      </div>
    </PageWrapper>
  );
};

export default BlogItem;
