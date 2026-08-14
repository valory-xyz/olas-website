import { MainMetricsData } from 'common-util/api/main-metrics';
import { isTxnMilestoneActive, REVALIDATE_DURATION } from 'common-util/constants';
import { getSnapshot } from 'common-util/snapshot-storage';
import { AgentsWorkingTogether } from 'components/HomepageSection/AgentsWorkingTogether';
import Hero from 'components/HomepageSection/Hero';
import Media from 'components/HomepageSection/Media';
import { OwnYourAgent } from 'components/HomepageSection/OwnYourAgent';
import { PowersAiAgentEconomies } from 'components/HomepageSection/PowersAiAgentEconomies';
import { PropelledBy } from 'components/HomepageSection/PropelledBy';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Home({ metrics, isTxnMilestone }) {
  const router = useRouter();

  useEffect(() => {
    if (window.location.hash === '#get-involved') {
      router.replace('/olas-token#choose-your-role');
    }
  }, [router]);

  return (
    <PageWrapper>
      <Meta ogPath="" />
      <Hero />
      <OwnYourAgent />
      <AgentsWorkingTogether />
      <PowersAiAgentEconomies metrics={metrics} isTxnMilestone={isTxnMilestone} />
      <PropelledBy />
      <Media />
    </PageWrapper>
  );
}

export const getStaticProps = async () => {
  const metricsSnapshot = await getSnapshot({ category: 'main' });

  const metrics = metricsSnapshot?.data ?? null;

  // Resolved here rather than in the component: a fixed prop renders the same
  // on server and client, so the date boundary can't cause a hydration mismatch.
  // ISR (5 min) re-evaluates it, so the celebration starts and ends on its own.
  const isTxnMilestone = isTxnMilestoneActive(
    (metrics as MainMetricsData | null)?.transactions?.value
  );

  return {
    props: {
      metrics,
      isTxnMilestone,
    },
    revalidate: REVALIDATE_DURATION,
  };
};
