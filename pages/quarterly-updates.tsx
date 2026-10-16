import { getBlogPostEntries } from 'common-util/api';
import { REVALIDATE_DURATION } from 'common-util/constants';
import { getSiteUrl } from 'common-util/getSiteUrl';
import { buildItemList } from 'common-util/structured-data';
import { BlogBackButton } from 'components/BlogBackButton';
import { QUARTERLY_UPDATES_FUNNEL_ID, Updates } from 'components/Content/Updates';
import { JsonLd } from 'components/JsonLd';
import PageWrapper from 'components/Layout/PageWrapper';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Meta from 'components/Meta';

const UpdatesPage = ({ itemList }) => (
  <PageWrapper>
    {itemList && <JsonLd data={itemList} />}
    <Meta
      pageTitle="Quarterly Updates"
      description="Stay informed with our latest quarterly updates, featuring key insights, progress reports, and upcoming developments."
    />
    <SectionWrapper>
      <BlogBackButton />
      <h1 className="mb-8 text-3xl lg:text-5xl tracking-tight font-extrabold text-gray-900 ">
        Quarterly Updates
      </h1>
      <Updates isMain={true} />
    </SectionWrapper>
  </PageWrapper>
);

// The cards load in the browser; the ItemList names the same posts in the served HTML.
export const getStaticProps = async () => ({
  props: {
    itemList: buildItemList({
      siteUrl: getSiteUrl(),
      path: '/quarterly-updates',
      name: 'Quarterly Updates',
      entries: await getBlogPostEntries({ funnelId: QUARTERLY_UPDATES_FUNNEL_ID }),
    }),
  },
  revalidate: REVALIDATE_DURATION,
});

export default UpdatesPage;
