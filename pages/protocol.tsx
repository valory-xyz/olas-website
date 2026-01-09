import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';
import { ProtocolAudits } from 'components/ProtocolPage/ProtocolAudits';
import { ProtocolCta } from 'components/ProtocolPage/ProtocolCta';
import { ProtocolHeader } from 'components/ProtocolPage/ProtocolHeader';
import { ProtocolKeyFeatures } from 'components/ProtocolPage/ProtocolKeyFeatures';
// import { WhyOlasProtocol } from 'components/ProtocolPage/WhyOlasProtocol';

const ProtocolPage = () => (
  <PageWrapper>
    <Meta pageTitle="Olas Protocol" description="Explore Olas Protocol Today" />

    <ProtocolHeader />
    <ProtocolKeyFeatures />
    {/* <WhyOlasProtocol /> */}
    <ProtocolAudits />
    <ProtocolCta />
  </PageWrapper>
);

export default ProtocolPage;
