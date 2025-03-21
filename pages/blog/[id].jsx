import { getBlog } from 'common-util/api';
import { formatDate } from 'common-util/formatDate';
import Markdown from 'common-util/Markdown';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';
import { Spinner } from 'components/Spinner';
import Image from 'next/image';
import { TEXT, TITLE } from 'styles/globals';

const BlogItem = ({ blog }) => {
  if (!blog) return <Spinner />;

  const { title, datePublished, body: content, headerImage } = blog.attributes;
  const formattedDate = formatDate(datePublished);
  const imagePath = headerImage?.data?.[0]?.attributes?.formats?.large?.url;
  const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}${imagePath}`;

  return (
    <PageWrapper>
      <Meta pageTitle={title} siteImageUrl={imageUrl} />
      <div className="max-w-3xl mx-auto p-4">
        {imagePath && (
          <Image
            src={imageUrl}
            width={headerImage.data[0].attributes.formats.large.width}
            height={headerImage.data[0].attributes.formats.large.height}
            alt={title}
            className="border mb-4 rounded-lg"
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
  const { id } = params;
  const blog = await getBlog(id);

  if (!blog) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      blog: blog,
    },
  };
}
