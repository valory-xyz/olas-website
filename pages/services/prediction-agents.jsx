import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';
import { GetInvolved } from 'components/PredictionAgentsPage/GetInvolved';
import { GetStarted } from 'components/PredictionAgentsPage/GetStarted';
import { Hero } from 'components/PredictionAgentsPage/Hero';
import { HowPredictionAgentsWork } from 'components/PredictionAgentsPage/HowPredictionAgentsWork';
import { PredictionMarkets } from 'components/PredictionAgentsPage/PredictionMarkets';
import { CTASection } from 'components/ui/section/cta';

const PredictionAgents = () => (
  <PageWrapper>
    <Meta
      pageTitle="Prediction Agents"
      description="Run an agent designed to trade in prediction markets on your behalf. Predict the future, autonomously."
      siteImageUrl="/images/services/prediction-agents.png"
    />
    <Hero />
    <div className="text-lg">
      <PredictionMarkets />
      <HowPredictionAgentsWork />
      <GetStarted />
      <GetInvolved />
      <CTASection
        text="Launch Prediction Trader - unlock tomorrow's opportunities today."
        ctaUrl="/operate"
        ctaText="Run an Agent Now"
      />
    </div>
  </PageWrapper>
);

export default PredictionAgents;
