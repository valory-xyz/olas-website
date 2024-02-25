import { getEducationArticle } from '@/common-util/api';
import PageWrapper from '@/components/Layout/PageWrapper';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/router';
// import Image from "next/image";
import Meta from '@/components/Meta';
import { Spinner } from '@/components/Spinner';
import { TEXT, TITLE, markdownComponents } from '@/styles/globals';

const EducationArticle = () => {
  const router = useRouter();
  const { educationArticleId } = router.query;
  const [educationArticle, setEducationArticle] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (educationArticleId) {
      getEducationArticle(educationArticleId).then(setEducationArticle);
    }
  }, [educationArticleId]);

  if (!educationArticle) return <Spinner />;

  const { title, body: content, headerImage } = educationArticle.attributes;
  const imagePath = headerImage?.data?.[0]?.attributes?.formats?.large?.url;
  const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}${imagePath}`;

  return (
    <PageWrapper>
      <Meta pageTitle={title} siteImageUrl={imageUrl} />
      <div className="max-w-3xl mx-auto p-4">
        {/* {!imageError && (
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
          )} */}
        <div className={`${TITLE.SMALL} mb-4`}>{title}</div>
        <ReactMarkdown
          className={TEXT}
          components={markdownComponents}
        >
          {content}
        </ReactMarkdown>
      </div>
    </PageWrapper>
  );
};

export default EducationArticle;

export async function getServerSideProps({ params }) {
  return {
    props: {
      educationArticleId: params.educationArticleId,
    },
  };
}
