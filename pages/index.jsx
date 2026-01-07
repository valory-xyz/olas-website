import { getSnapshot } from 'common-util/snapshot-storage';
import { AgentsWorkingTogether } from 'components/HomepageSection/AgentsWorkingTogether';
import Hero from 'components/HomepageSection/Hero';
import Media from 'components/HomepageSection/Media';
import { OwnYourAgent } from 'components/HomepageSection/OwnYourAgent';
import { PowersAiAgentEconomies } from 'components/HomepageSection/PowersAiAgentEconomies';
import { PropelledBy } from 'components/HomepageSection/PropelledBy';
import { TrustedBy } from 'components/HomepageSection/TrustedBy';
import { WorldOfAgents } from 'components/HomepageSection/WorldOfAgents';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Home({ metrics }) {
  const router = useRouter();

  useEffect(() => {
    if (window.location.hash === '#get-involved') {
      router.replace('/olas-token#choose-your-role');
    }
  }, [router]);

  return (
    <PageWrapper>
      <Meta />
      <Hero />
      <WorldOfAgents />
      <OwnYourAgent />
      <AgentsWorkingTogether />
      <PowersAiAgentEconomies metrics={metrics} />
      <TrustedBy />
      <PropelledBy />
      <Media />
    </PageWrapper>
  );
}

export const getStaticProps = async () => {
  const metricsSnapshot = await getSnapshot({ category: 'main' });

  const metrics = metricsSnapshot?.data || null;
  const mappedMetrics = metrics
    ? {
        ...metrics,
        mechTurnover: metrics.mechFees,
      }
    : null;

  return {
    props: {
      metrics: mappedMetrics,
    },
    revalidate: 3600, // revalidate every hour.
  };
};
