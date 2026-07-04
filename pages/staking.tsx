import { InfoNotice } from 'components/InfoNotice';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';
import { Staking } from 'components/StakingPage';

const StakingPage = () => (
  <PageWrapper>
    <Meta
      pageTitle="Staking"
      description="The engine for the autonomous agent economy. A powerful upgrade with the potential to drive massive growth and opportunity for the Olas community and other protocols."
    />
    <Staking />
    <InfoNotice />
  </PageWrapper>
);

export default StakingPage;
