import { useRouter } from 'next/router';

import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';
import Operate from 'components/OperatePage';

const firstRewardImageSrc = '/images/operate-page/pear-first-reward.png';

const OperatePage = () => {
  const router = useRouter();
  const rewardType = router.query?.pearl;
  const image = rewardType === 'first-reward' ? firstRewardImageSrc : undefined;

  return (
    <PageWrapper>
      <Meta
        pageTitle="Run & own AI Agents in Crypto with Olas"
        description="Become an Operator in the Olas ecosystem using Pearl. Run AI agents, stake assets, and earn rewards while helping to expand the crypto and AI agent network. Get involved in managing decentralized AI-powered systems."
        siteImageUrl={image}
      />
      <Operate />
    </PageWrapper>
  );
};

export default OperatePage;
