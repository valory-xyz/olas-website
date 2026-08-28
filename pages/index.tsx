import type { OtherMetricsData } from 'common-util/api/other-metrics';
import { REVALIDATE_DURATION } from 'common-util/constants';
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

export default function Home({ metrics, protocolMetrics }) {
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
      <PowersAiAgentEconomies metrics={metrics} protocolMetrics={protocolMetrics} />
      <PropelledBy />
      <Media />
    </PageWrapper>
  );
}

export const getStaticProps = async () => {
  const [metricsSnapshot, otherSnapshot] = await Promise.all([
    getSnapshot({ category: 'main' }),
    getSnapshot({ category: 'other' }),
  ]);

  const metrics = metricsSnapshot?.data ?? null;
  // Only the protocol slice — the rest of the 'other' snapshot (tokenomics
  // series, holders) would bloat the page JSON for nothing.
  const protocolMetrics = (otherSnapshot?.data as OtherMetricsData | null)?.protocol ?? null;

  return {
    props: {
      metrics,
      protocolMetrics,
    },
    revalidate: REVALIDATE_DURATION,
  };
};
