import Articles from '@/components/Content/Articles';
import PageWrapper from '@/components/Layout/PageWrapper';
import SectionWrapper from '@/components/Layout/SectionWrapper';
import Meta from '@/components/Meta';

const ArticlesPage = () => (
  <PageWrapper>
    <Meta pageTitle="Blog" />
    <SectionWrapper>
      <Articles />
    </SectionWrapper>
  </PageWrapper>
);

export default ArticlesPage;
