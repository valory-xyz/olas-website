import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';
import { OptimusHero } from 'components/OptimusPage/OptimusHero';

const Optimus = () => (
  <PageWrapper>
    <Meta pageTitle="Optimus" description="AI Agent-powered DeFi Management" />

    <OptimusHero />
  </PageWrapper>
);

export default Optimus;
