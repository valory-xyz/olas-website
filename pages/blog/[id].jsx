import { getBlog } from 'common-util/api';
import { formatDate } from 'common-util/formatDate';
import Markdown from 'common-util/Markdown';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';
import { Spinner } from 'components/Spinner';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { TEXT, TITLE } from 'styles/globals';

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
    title,
    datePublished,
    body: content,
    headerImage,
  } = blogItem.attributes;
  const formattedDate = formatDate(datePublished);
  const imagePath = headerImage?.data?.[0]?.attributes?.formats?.large?.url;
  const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}${imagePath}`;

  return (
    <PageWrapper>
      <Meta pageTitle={title} siteImageUrl={imageUrl} />
      <div className="max-w-3xl mx-auto p-4">
        {!imageError && imagePath && (
          <Image
            src={imageUrl}
            width={headerImage.data[0].attributes.formats.large.width}
            height={headerImage.data[0].attributes.formats.large.height}
            alt={title}
            className="border mb-4 rounded-lg"
            onError={() => setImageError(true)}
          />
        )}
        <h1 className={`${TITLE.SMALL} mb-4`}>{title}</h1>
        <div className={`${TEXT} mb-4`}>{formattedDate}</div>
        <Markdown>{content}</Markdown>
      </div>
    </PageWrapper>
  );
};

export default BlogItem;

export async function getServerSideProps({ params }) {
  return {
    props: {
      id: params.id,
    },
  };
}
