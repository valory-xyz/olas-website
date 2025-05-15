import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';
import Operate from 'components/OperatePage';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const OperatePage = () => {
  const router = useRouter();

  useEffect(() => {
    if (window.location.hash === '#download') {
      // redirect to new pearl page
      router.replace('/pearl#download');
    }
  }, [router]);

  return (
    <PageWrapper>
      <Meta
        pageTitle="Run & own AI Agents in Crypto with Olas"
        description="Become an Operator in the Olas ecosystem. Run AI agents, stake assets, and earn rewards while helping to expand the crypto and AI agent network. Get involved in managing decentralized AI-powered systems."
      />
      <Operate />
    </PageWrapper>
  );
};

export default OperatePage;
