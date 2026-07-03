import { AU } from 'components/AUPage';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const AUPage = () => (
  <PageWrapper>
    <Meta
      pageTitle="Agents Unleashed"
      description="Join Olas as a Bonder: provide liquidity to support the network and receive OLAS in return, subject to program availability and vesting."
      ogPath="agents-unleashed"
    />
    <AU />
  </PageWrapper>
);

export default AUPage;
