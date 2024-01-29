import { useRouter } from 'next/router';
import Image from "next/image";
import PageWrapper from '@/components/Layout/PageWrapper';
import { useEffect, useState } from 'react';
import { getBlog } from '@/common-util/api';
import { TEXT, TITLE } from '@/styles/globals';
import Markdown from 'react-markdown'
import Meta from '@/components/Meta';
import { Spinner } from '@/components/Spinner';

const markdownComponents = {
  // Apply tailwind classes to style links
  a: ({node, ...props}) => <a className="text-purple-800 hover:text-blue-800" {...props} />,
  // Apply margin to paragraphs to create space between them
  p: ({node, ...props}) => <p className="mb-4" {...props} />,
  // Apply tailwind classes to style lists
  ul: ({node, ...props}) => <ul className="list-disc list-inside" {...props} />,
  ol: ({node, ...props}) => <ol className="list-decimal list-inside" {...props} />,
  li: ({node, ...props}) => <li className="mb-2" {...props} />,
  h1: ({node, ...props}) => <h1 className="text-3xl font-bold mb-4" {...props} />,
  h2: ({node, ...props}) => <h2 className="text-2xl font-semibold mb-3" {...props} />,
  h3: ({node, ...props}) => <h3 className="text-xl font-medium mb-2" {...props} />,
  h4: ({node, ...props}) => <h4 className="text-lg font-medium mb-1" {...props} />,
  h5: ({node, ...props}) => <h5 className="text-md font-medium" {...props} />,
  h6: ({node, ...props}) => <h6 className="text-sm font-medium" {...props} />,
  pre: ({node, ...props}) => <pre className="p-4 bg-gray-800 text-white rounded-md overflow-auto" {...props} />,
  code: ({node, ...props}) => <code className="text-sm" {...props} />,
}

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

  const { title, datePublished, body: content, headerImage } = blogItem.attributes;
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
            className='border mb-4 rounded-lg'
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
