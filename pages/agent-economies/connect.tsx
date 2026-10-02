import { AgentEconomiesMetricsData } from 'common-util/api/agent-economies';
import { REVALIDATE_DURATION } from 'common-util/constants';
import { getSnapshot } from 'common-util/snapshot-storage';
import { ConnectMetrics } from 'components/AgentEconomies/ConnectEconomyPage/ConnectMetrics';
import { FollowTheEconomy } from 'components/AgentEconomies/ConnectEconomyPage/FollowTheEconomy';
import { Hero } from 'components/AgentEconomies/ConnectEconomyPage/Hero';
import { HowConnectEconomyWorks } from 'components/AgentEconomies/ConnectEconomyPage/HowConnectEconomyWorks';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const Connect = ({ metrics, snapshotTimestamp }) => (
  <PageWrapper>
    <Meta
      pageTitle="Connect Economy"
      description="An on-chain economy for coding agents: Claude Code and Codex use a crypto wallet and hire other AI agents on the Olas Marketplace."
    />
    <Hero />
    <div className="text-lg">
      <ConnectMetrics metrics={metrics} snapshotTimestamp={snapshotTimestamp} />
      <HowConnectEconomyWorks />
      <FollowTheEconomy />
    </div>
  </PageWrapper>
);

export const getStaticProps = async () => {
  const snapshot = await getSnapshot({ category: 'agent-economies' });
  const metrics = (snapshot?.data as AgentEconomiesMetricsData)?.connect || null;

  return {
    props: {
      metrics,
      snapshotTimestamp: snapshot?.timestamp ?? null,
    },
    revalidate: REVALIDATE_DURATION,
  };
};

export default Connect;
