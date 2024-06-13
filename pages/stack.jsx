import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';
import { StackHeader } from 'components/StackPage/StackHeader';
import { StackCta } from 'components/StackPage/StackCta';
import { StackKeyFeatures } from 'components/StackPage/StackKeyFeatures';
// import { StackFaq } from 'components/StackPage/StackFaq';

const StackPage = () => (
  <PageWrapper>
    <Meta pageTitle="Stack" description="Explore Olas Stack Today" />

    <StackHeader />
    <StackKeyFeatures />
    {/* <StackFaq /> */}
    <StackCta />
  </PageWrapper>
);

export default StackPage;
