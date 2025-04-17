import { getBlog } from 'common-util/api';
import { formatDate } from 'common-util/formatDate';
import Markdown from 'common-util/Markdown';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';
import { Spinner } from 'components/Spinner';
import Image from 'next/image';
import { TEXT, TITLE } from 'styles/globals';

const DESC_CHAR_LIMIT = 160;

const stripMarkdown = (markdown) => {
  // Remove markdown links, images and syntax
  let text = markdown.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '');
  text = text.replace(/(\*\*|__|\*|_|`|#+|\n)/g, ' ');
  // Remove extra spaces
  text = text.replace(/\s+/g, ' ').trim();
  return text;
};

const getDesc = (input, charLimit) => {
  const plainText = stripMarkdown(input);
  return plainText
    .split(/[\s\n]/)
    .reduce((acc, word) => {
      const currentLength = acc.join(' ').length + (acc.length > 0 ? 1 : 0);
      if (currentLength + word.length <= charLimit) {
        acc.push(word);
      } else {
        return acc;
      }
      return acc;
    }, [])
    .join(' ');
};

const BlogItem = ({ blog }) => {
  if (!blog) return <Spinner />;

  const { title, datePublished, body: content, headerImage } = blog.attributes;
  const formattedDate = formatDate(datePublished);
  const imagePath = headerImage?.data?.[0]?.attributes?.formats?.large?.url;
  const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}${imagePath}`;

  const formattedContent = <Markdown>{content}</Markdown>;
  const description = getDesc(formattedContent.props.children, DESC_CHAR_LIMIT);

  return (
    <PageWrapper>
      <Meta
        pageTitle={title}
        description={description}
        siteImageUrl={imageUrl}
      />
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
