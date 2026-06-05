import { getBlog } from 'common-util/api';
import { formatDate } from 'common-util/formatDate';
import { getApiUrl } from 'common-util/getApiUrl';
import { getLimitedText } from 'common-util/getLimitedText';
import Markdown from 'common-util/Markdown';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';
import { Spinner } from 'components/Spinner';
import { isArray } from 'lodash';
import Image from 'next/image';
import { TEXT, TITLE } from 'styles/globals';

const DESC_CHAR_LIMIT = 160;

const BlogItem = ({ blog }) => {
  if (!blog) return <Spinner />;

  const { title, datePublished, body: content, headerImage } = blog;
  const formattedDate = formatDate(datePublished);
  // blogs use multiple-media headerImage (array); tolerate single-media (object) too.
  const headerImageData = isArray(headerImage) ? headerImage?.[0] : headerImage;
  const image = headerImageData?.formats?.large;
  const imagePath = image?.url;
  const apiUrl = getApiUrl();
  const imageUrl = apiUrl && imagePath ? `${apiUrl}${imagePath}` : '';

  const formattedContent = (
    <Markdown className="text-lg text-gray-700 leading-relaxed">{content}</Markdown>
  );
  const description = getLimitedText(formattedContent.props.children, DESC_CHAR_LIMIT);

  return (
    <PageWrapper>
      <Meta pageTitle={title} description={description} siteImageUrl={imageUrl} />
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-10">
        {imagePath && (
          <Image
            src={imageUrl}
            width={image.width}
            height={image.height}
            alt={title}
            className="border mb-12 rounded-lg"
          />
        )}
        <h1 className={`${TITLE.SMALL} mb-3`}>{title}</h1>
        <div className={`${TEXT} mb-8`}>{formattedDate}</div>
        {formattedContent}
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
