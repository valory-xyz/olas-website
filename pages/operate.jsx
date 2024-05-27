import Operate from 'components/OperatePage';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

const firstRewardImageSrc = '/images/operate-page/pear-first-reward.png';

const OperatePage = () => {
  const router = useRouter();
  const rewardType = router.query?.pearl;
  const image = useMemo(() => {
    if (rewardType === 'first-reward') {
      return firstRewardImageSrc;
    }
    return undefined;
  }, [rewardType]);

  return (
    <PageWrapper>
      <Meta pageTitle="Olas Operate" siteImageUrl={image} />
      <Operate />
    </PageWrapper>
  );
};

export default OperatePage;
