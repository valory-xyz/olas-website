import { Activity } from 'components/HomepageSection/Activity';
import { AgentsWorkingTogether } from 'components/HomepageSection/AgentsWorkingTogether';
import GetInvolved from 'components/HomepageSection/GetInvolved';
import Hero from 'components/HomepageSection/Hero';
import Media from 'components/HomepageSection/Media';
import { OwnYourAgent } from 'components/HomepageSection/OwnYourAgent';
import { PowersAIAgentEconomies } from 'components/HomepageSection/PowersAIAgentEconomies';
import { PropelledBy } from 'components/HomepageSection/PropelledBy';
import UseCases from 'components/HomepageSection/UseCases';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

export default function Home() {
  return (
    <PageWrapper>
      <Meta />
      <Hero />
      <Activity />
      <UseCases />
      <OwnYourAgent />
      <AgentsWorkingTogether />
      <PowersAIAgentEconomies />
      <GetInvolved />
      <PropelledBy />
      <Media />
    </PageWrapper>
  );
}
