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
        pageTitle="Olas Operate"
        description="Join the Olas ecosystem as an Operator using Pearl. Run agents, stake & earn rewards!"
        siteImageUrl={image}
      />
      <Operate />
    </PageWrapper>
  );
};

export default OperatePage;
