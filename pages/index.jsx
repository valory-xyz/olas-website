import { Activity } from 'components/HomepageSection/Activity';
import { AgentsWorkingTogether } from 'components/HomepageSection/AgentsWorkingTogether';
import GetInvolved from 'components/HomepageSection/GetInvolved';
import Hero from 'components/HomepageSection/Hero';
import Media from 'components/HomepageSection/Media';
import { PropelledBy } from 'components/HomepageSection/PropelledBy';
import { TheTech } from 'components/HomepageSection/TheTech';
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
      <AgentsWorkingTogether />
      <TheTech />
      <GetInvolved />
      <PropelledBy />
      <Media />
    </PageWrapper>
  );
}
