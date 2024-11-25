import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';
import Hero from 'components/HomepageSection/Hero';
import { Activity } from 'components/HomepageSection/Activity';
import UseCases from 'components/HomepageSection/UseCases';
import { TheTech } from 'components/HomepageSection/TheTech';
import { PropelledBy } from 'components/HomepageSection/PropelledBy';
import GetInvolved from 'components/HomepageSection/GetInvolved';
import Media from 'components/HomepageSection/Media';

export default function Home() {
  return (
    <PageWrapper>
      <Meta />
      <Hero />
      <Activity />
      <UseCases />
      <TheTech />
      <GetInvolved />
      <PropelledBy />
      <Media />
    </PageWrapper>
  );
}
