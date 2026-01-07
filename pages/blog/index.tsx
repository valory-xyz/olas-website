import { TITLE_CLASS } from 'common-util/classes';
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
      <h1 className={TITLE_CLASS}>Blog</h1>
      <Articles isMain displayFolders />
    </SectionWrapper>
  </PageWrapper>
);

export default ArticlesPage;
