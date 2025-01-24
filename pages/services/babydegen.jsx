import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';
import BabyDegen from 'components/Services/BabyDegenPage';

const BabyDegenPage = () => (
  <PageWrapper>
    <Meta
      pageTitle="BabyDegen"
      description="BabyDegen is your very own autonomous trading agent, designed to navigate the fast-paced world of DeFi."
      siteImageUrl="/images/services/babydegen/babydegen.png"
    />
    <BabyDegen />
  </PageWrapper>
);

export default BabyDegenPage;
