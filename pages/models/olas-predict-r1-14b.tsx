import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';
import { ExampleForecasts } from 'components/ModelsPage/OlasPredictR1/ExampleForecasts';
import { ForecastingResults } from 'components/ModelsPage/OlasPredictR1/ForecastingResults';
import { MODEL_NAME } from 'components/ModelsPage/OlasPredictR1/constants';
import { Hero } from 'components/ModelsPage/OlasPredictR1/Hero';
import { RunItYourself } from 'components/ModelsPage/OlasPredictR1/RunItYourself';
import { StatsStrip } from 'components/ModelsPage/OlasPredictR1/StatsStrip';

const OlasPredictR1Page = () => (
  <PageWrapper>
    <Meta
      pageTitle={MODEL_NAME}
      description="A specialized, open-weight AI model designed to estimate the probability of future events. Explore its past forecasts alongside their outcomes."
    />
    <Hero />
    <StatsStrip />
    <ForecastingResults />
    <ExampleForecasts />
    <RunItYourself />
  </PageWrapper>
);

export default OlasPredictR1Page;
