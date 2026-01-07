import { PEARL_YOU_URL, REVALIDATE_DURATION } from 'common-util/constants';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';
import Operate from 'components/OperatePage';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { getSnapshot } from 'common-util/snapshot-storage';

const OperatePage = ({ metrics }) => {
  const router = useRouter();

  useEffect(() => {
    if (window.location.hash === '#download') {
      // redirect to new pearl page
      router.replace(PEARL_YOU_URL);
    }
  }, [router]);

  return (
    <PageWrapper>
      <Meta
        pageTitle="Operate"
        description="Become an Operator in the Olas ecosystem. Run AI agents, stake assets, and earn rewards while helping to expand the crypto and AI agent network. Get involved in managing decentralized AI-powered systems."
      />
      <Operate metrics={metrics} />
    </PageWrapper>
  );
};

export const getStaticProps = async () => {
  const snapshot = await getSnapshot({ category: 'main' });
  const metrics = snapshot?.data || null;

  return {
    props: {
      metrics,
    },
    revalidate: REVALIDATE_DURATION,
  };
};

export default OperatePage;
