import { getBlogPostEntries } from 'common-util/api';
import { REVALIDATE_DURATION } from 'common-util/constants';
import { getSiteUrl } from 'common-util/getSiteUrl';
import { buildItemList } from 'common-util/structured-data';
import { BlogBackButton } from 'components/BlogBackButton';
import { CASE_STUDIES_FUNNEL_ID, CaseStudies } from 'components/Content/CaseStudies';
import { JsonLd } from 'components/JsonLd';
import PageWrapper from 'components/Layout/PageWrapper';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Meta from 'components/Meta';

const CaseStudiesPage = ({ itemList }) => (
  <PageWrapper>
    {itemList && <JsonLd data={itemList} />}
    <Meta
      pageTitle="Case Studies"
      description="Read up on the various success stories achieved with Olas!"
    />
    <SectionWrapper>
      <BlogBackButton />
      <CaseStudies />
    </SectionWrapper>
  </PageWrapper>
);

// The cards load in the browser; the ItemList names the same posts in the served HTML.
export const getStaticProps = async () => ({
  props: {
    itemList: buildItemList({
      siteUrl: getSiteUrl(),
      path: '/case-studies',
      name: 'Case Studies',
      entries: await getBlogPostEntries({ funnelId: CASE_STUDIES_FUNNEL_ID }),
    }),
  },
  revalidate: REVALIDATE_DURATION,
});

export default CaseStudiesPage;
