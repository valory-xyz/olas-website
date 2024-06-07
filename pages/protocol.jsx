import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';
import { ProtocolHeader } from 'components/ProtocolPage/ProtocolHeader';
import { ProtocolKeyFeatures } from 'components/ProtocolPage/ProtocolKeyFeatures';
import { ProtocolCta } from 'components/ProtocolPage/ProtocolCta';
import { WhyOlasProtocol } from 'components/ProtocolPage/WhyOlasProtocol';

const ProtocolPage = () => (
  <PageWrapper>
    <Meta pageTitle="Olas Protocol" description="Explore Olas Protocol Today" />

    <ProtocolHeader />
    <ProtocolKeyFeatures />
    <WhyOlasProtocol />
    <ProtocolCta />
  </PageWrapper>
);

export default ProtocolPage;
