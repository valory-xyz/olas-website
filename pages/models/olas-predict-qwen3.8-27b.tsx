import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';
import { ExampleForecasts } from 'components/ModelsPage/OlasPredictQwen/ExampleForecasts';
import { ForecastingResults } from 'components/ModelsPage/OlasPredictQwen/ForecastingResults';
import { Hero } from 'components/ModelsPage/OlasPredictQwen/Hero';
import { RunItYourself } from 'components/ModelsPage/OlasPredictQwen/RunItYourself';
import { StatsStrip } from 'components/ModelsPage/OlasPredictQwen/StatsStrip';

const OlasPredictQwenPage = () => (
  <PageWrapper>
    <Meta
      pageTitle="Predict-Qwen3.8-27B"
      description="An open-weight AI model designed to estimate the probability of real-world events. See how its forecasts compare with GPT-5.6."
    />
    <Hero />
    <StatsStrip />
    <ForecastingResults />
    <ExampleForecasts />
    <RunItYourself />
  </PageWrapper>
);

export default OlasPredictQwenPage;
