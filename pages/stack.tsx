import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';
import { StackHeader } from 'components/StackPage/StackHeader';
import { StackKeyFeatures } from 'components/StackPage/StackKeyFeatures';
// import { StackFaq } from 'components/StackPage/StackFaq';

const StackPage = () => (
  <PageWrapper>
    <Meta pageTitle="Stack" description="Explore Olas Stack Today" />

    <StackHeader />
    <StackKeyFeatures />
    {/* <StackFaq /> */}
  </PageWrapper>
);

export default StackPage;
