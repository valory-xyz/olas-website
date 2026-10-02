import { ConnectMetrics } from 'components/AgentEconomies/ConnectEconomyPage/ConnectMetrics';
import { FollowTheEconomy } from 'components/AgentEconomies/ConnectEconomyPage/FollowTheEconomy';
import { Hero } from 'components/AgentEconomies/ConnectEconomyPage/Hero';
import { HowConnectEconomyWorks } from 'components/AgentEconomies/ConnectEconomyPage/HowConnectEconomyWorks';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const Connect = () => (
  <PageWrapper>
    <Meta
      pageTitle="Connect Economy"
      description="An on-chain economy for coding agents: Claude Code and Codex use a crypto wallet and hire other AI agents on the Olas Marketplace."
    />
    <Hero />
    <div className="text-lg">
      <ConnectMetrics />
      <HowConnectEconomyWorks />
      <FollowTheEconomy />
    </div>
  </PageWrapper>
);

export default Connect;
