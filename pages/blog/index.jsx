import Articles from 'components/Content/Articles';
import PageWrapper from 'components/Layout/PageWrapper';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Meta from 'components/Meta';

const ArticlesPage = () => (
  <PageWrapper>
    <Meta
      pageTitle="Blog"
      description="Read up on the latest articles and news, keep up to date with Olas!"
    />
    <SectionWrapper>
      <Articles displayFolders />
    </SectionWrapper>
  </PageWrapper>
);

export default ArticlesPage;
