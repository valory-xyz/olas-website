import { FAQ } from 'components/Agents/PredictionAgentsPage/FAQ';
import { GetInvolved } from 'components/Agents/PredictionAgentsPage/GetInvolved';
import { GetStarted } from 'components/Agents/PredictionAgentsPage/GetStarted';
import { Hero } from 'components/Agents/PredictionAgentsPage/Hero';
import { HowPredictionAgentsWork } from 'components/Agents/PredictionAgentsPage/HowPredictionAgentsWork';
import { PredictionMarkets } from 'components/Agents/PredictionAgentsPage/PredictionMarkets';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';
import { CTASection } from 'components/ui/section/cta';

const PredictionAgents = () => (
  <PageWrapper>
    <Meta
      pageTitle="Prediction Agents"
      description="Run an agent designed to trade in prediction markets on your behalf. Predict the future, autonomously."
      siteImageUrl="/images/agents/prediction-agents.png"
    />
    <Hero />
    <div className="text-lg">
      <PredictionMarkets />
      <HowPredictionAgentsWork />
      <GetStarted />
      <GetInvolved />
      <FAQ />
      <CTASection
        text="Launch Omenstrat - unlock tomorrow's opportunities today."
        ctaUrl="/operate"
        ctaText="Run an Agent Now"
      />
    </div>
  </PageWrapper>
);

export default PredictionAgents;
