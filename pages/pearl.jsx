import { useRouter } from 'next/router';

import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';
import Pearl from 'components/PearlPage';

const firstRewardImageSrc = '/images/operate-page/pear-first-reward.png';

const PearlPage = () => {
  const router = useRouter();
  const rewardType = router.query?.pearl;
  const image = rewardType === 'first-reward' ? firstRewardImageSrc : undefined;

  return (
    <PageWrapper>
      <Meta
        pageTitle="Pearl"
        description="Pearl brings you the ultimate collection of AI agents in one app."
        siteImageUrl={image}
      />
      <Pearl />
    </PageWrapper>
  );
};

export default PearlPage;
