import { getBlog } from 'common-util/api';
import { formatDate } from 'common-util/formatDate';
import { getApiUrl } from 'common-util/getApiUrl';
import { getLimitedText } from 'common-util/getLimitedText';
import { getSiteUrl } from 'common-util/getSiteUrl';
import Markdown from 'common-util/Markdown';
import { buildArticle } from 'common-util/structured-data';
import { JsonLd } from 'components/JsonLd';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';
import { Spinner } from 'components/Spinner';
import { isArray } from 'lodash';
import Image from 'next/image';
import { TEXT, TITLE } from 'styles/globals';

const DESC_CHAR_LIMIT = 160;

const BlogItem = ({ blog }) => {
  if (!blog) return <Spinner />;

  const { title, datePublished, updatedAt, slug, author, body: content, headerImage } = blog;
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

  // Built from the same record the page renders. `author` is a plain string in the CMS
  // schema and absent on most posts; a post without one is credited to Olas.
  const postPath = `/blog/${slug ?? blog.id}`;
  const article = buildArticle({
    siteUrl: getSiteUrl(),
    path: postPath,
    title,
    description,
    datePublished,
    dateModified: updatedAt,
    imageUrl: imageUrl || undefined,
    author,
  });

  return (
    <PageWrapper>
      <JsonLd data={article} />
      {/* A post opened by numeric id would otherwise canonicalise to `/blog/123` while
          the Article's mainEntityOfPage says `/blog/<slug>`; one URL for both. */}
      <Meta
        pageTitle={title}
        description={description}
        siteImageUrl={imageUrl}
        canonicalPath={postPath}
      />
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
