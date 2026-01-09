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
    <SectionWrapper>
      <BlogBackButton />
      <CaseStudies />
    </SectionWrapper>
  </PageWrapper>
);

export default CaseStudiesPage;
