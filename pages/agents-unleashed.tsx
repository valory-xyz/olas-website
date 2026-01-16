import { AU } from 'components/AUPage';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const AUPage = () => (
  <PageWrapper>
    <Meta
      pageTitle="Agents Unleashed"
      description="Join Olas as a Bonder, get discounted OLAS tokens, provide liquidity, grow the network, and earn rewards in AI and crypto."
    />
    <AU />
  </PageWrapper>
);

export default AUPage;
