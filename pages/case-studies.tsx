import { BlogBackButton } from 'components/BlogBackButton';
import { CaseStudies } from 'components/Content/CaseStudies';
import PageWrapper from 'components/Layout/PageWrapper';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Meta from 'components/Meta';

const CaseStudiesPage = () => (
  <PageWrapper>
    <Meta
      pageTitle="Case Studies"
      description="Read up on the various success stories achieved with Olas!"
    />
    // @ts-expect-error TS(2304) FIXME: Cannot find name 'ch'.
    // @ts-expect-error TS(2741): Property 'backgroundType' is missing in type '{ ch... Remove this comment to see the full error message
    <SectionWrapper>
      <BlogBackButton />
      <CaseStudies />
    </SectionWrapper>
  </PageWrapper>
);

export default CaseStudiesPage;
