// import Hero from 'components/HomepageSection/Hero';
// import ForDAOs from 'components/HomepageSection/ForDAOs';
// import ForDevs from 'components/HomepageSection/ForDevs';
// import Flywheel from 'components/HomepageSection/Flywheel';
// import Framework from 'components/HomepageSection/Framework';
// import Services from 'components/HomepageSection/Services';
// import AppShowcase from 'components/HomepageSection/AppShowcase';
// import Content from 'components/HomepageSection/Content';
// import Friends from 'components/HomepageSection/Friends';
// import Contribute from 'components/HomepageSection/Contribute';
// import Affordances from 'components/HomepageSection/Affordances';

import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';
import Hero from 'components/HomepageSection/Hero';
import Activity from 'components/HomepageSection/Activity';

export default function Home() {
  return (
    <PageWrapper>
      <Meta />
      <Hero />
      <Activity />

      {/* <Hero />
      <Affordances />
      <Services />
      <ForDAOs />
      <ForDevs />
      <Flywheel />
      <Framework />
      <AppShowcase />
      <Content />
      <Friends />
      <Contribute /> */}
    </PageWrapper>
  );
}
