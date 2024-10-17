import PageWrapper from 'components/Layout/PageWrapper';
import { MechHero } from 'components/MechPage/MechHero';
import Meta from 'components/Meta';

const Mech = () => (
  <PageWrapper>
    <Meta pageTitle="Mech" description="AI intelligence for agent economies" />

    <MechHero />
  </PageWrapper>
);

export default Mech;
