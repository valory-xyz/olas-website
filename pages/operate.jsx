import { useRouter } from 'next/router';

import Operate from 'components/OperatePage';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const firstRewardImageSrc = '/images/operate-page/pear-first-reward.png';

const OperatePage = () => {
  const router = useRouter();
  const rewardType = router.query?.pearl;
  const image = rewardType === 'first-reward' ? firstRewardImageSrc : undefined;

  return (
    <PageWrapper>
      <Meta pageTitle="Olas Operate" siteImageUrl={image} />
      <Operate />
    </PageWrapper>
  );
};

export default OperatePage;
