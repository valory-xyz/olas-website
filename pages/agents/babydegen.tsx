import BabyDegen from 'components/Agents/BabyDegenPage';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const BabyDegenPage = () => (
  <PageWrapper>
    <Meta
      pageTitle="BabyDegen"
      description="BabyDegen is your very own autonomous trading agent, designed to navigate the fast-paced world of DeFi."
      siteImageUrl="/images/agents/babydegen/babydegen.png"
    />
    <BabyDegen />
  </PageWrapper>
);

export default BabyDegenPage;
