import { AgentsWorkingTogether } from 'components/HomepageSection/AgentsWorkingTogether';
import GetInvolved from 'components/HomepageSection/GetInvolved';
import Hero from 'components/HomepageSection/Hero';
import Media from 'components/HomepageSection/Media';
import { OwnYourAgent } from 'components/HomepageSection/OwnYourAgent';
import { PowersAIAgentEconomies } from 'components/HomepageSection/PowersAIAgentEconomies';
import { PropelledBy } from 'components/HomepageSection/PropelledBy';
import { TrustedBy } from 'components/HomepageSection/TrustedBy';
import { WorldOfAgents } from 'components/HomepageSection/WorldOfAgents';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

export default function Home() {
  return (
    <PageWrapper>
      <Meta />
      <Hero />
      <WorldOfAgents />
      <OwnYourAgent />
      <AgentsWorkingTogether />
      <PowersAIAgentEconomies />
      <GetInvolved />
      <TrustedBy />
      <PropelledBy />
      <Media />
    </PageWrapper>
  );
}
