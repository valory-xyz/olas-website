import { getEducationArticle } from 'common-util/api';
import { getApiUrl } from 'common-util/getApiUrl';
import Markdown from 'common-util/Markdown';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';
import { Spinner } from 'components/Spinner';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { TEXT, TITLE } from 'styles/globals';

const EducationArticle = () => {
  const router = useRouter();
  const { educationArticleId } = router.query;
  const [educationArticle, setEducationArticle] = useState(null);

  useEffect(() => {
    if (educationArticleId) {
      getEducationArticle(educationArticleId).then(setEducationArticle);
    }
  }, [educationArticleId]);

  if (!educationArticle) return <Spinner />;

  const { title, body: content, headerImage } = educationArticle.attributes;
  const imagePath = headerImage?.data?.[0]?.attributes?.formats?.large?.url;
  const apiUrl = getApiUrl();
  const imageUrl = apiUrl && imagePath ? `${apiUrl}${imagePath}` : '';

  return (
    <PageWrapper>
      <Meta pageTitle={title} siteImageUrl={imageUrl} />
      <div className="max-w-3xl mx-auto p-4">
        <div className={`${TITLE.SMALL} mb-4`}>{title}</div>
        <Markdown className={TEXT}>{content}</Markdown>
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
