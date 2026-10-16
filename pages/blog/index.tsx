import { getBlogPostEntries } from 'common-util/api';
import { TITLE_CLASS } from 'common-util/classes';
import { REVALIDATE_DURATION } from 'common-util/constants';
import { getSiteUrl } from 'common-util/getSiteUrl';
import { buildBlog } from 'common-util/structured-data';
import Articles from 'components/Content/Articles';
import { JsonLd } from 'components/JsonLd';
import PageWrapper from 'components/Layout/PageWrapper';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Meta from 'components/Meta';

const ArticlesPage = ({ blog }) => (
  <PageWrapper>
    {blog && <JsonLd data={blog} />}
    <Meta
      ogPath="blog"
      pageTitle="Blog"
      description="Read up on the latest articles and news, keep up to date with Olas!"
    />
    <SectionWrapper>
      <h1 className={TITLE_CLASS}>Blog</h1>
      <Articles isMain displayFolders />
    </SectionWrapper>
  </PageWrapper>
);

// The cards load in the browser; the Blog block names the same posts in the served HTML.
export const getStaticProps = async () => ({
  props: {
    blog: buildBlog({
      siteUrl: getSiteUrl(),
      path: '/blog',
      name: 'Blog',
      entries: await getBlogPostEntries(),
    }),
  },
  revalidate: REVALIDATE_DURATION,
});

export default ArticlesPage;
