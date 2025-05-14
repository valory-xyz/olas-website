import { useRouter } from 'next/router';

import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';
import Operate from 'components/PearlPage';

const firstRewardImageSrc = '/images/operate-page/pear-first-reward.png';

const PearlPage = () => {
  const router = useRouter();
  const rewardType = router.query?.pearl;
  const image = rewardType === 'first-reward' ? firstRewardImageSrc : undefined;

  return (
    <PageWrapper>
      <Meta pageTitle="" description="" siteImageUrl={image} />
      <Operate />
    </PageWrapper>
  );
};

export default PearlPage;
