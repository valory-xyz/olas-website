import Meta from 'components/Meta';
import PageWrapper from 'components/Layout/PageWrapper';
import { PredictHero } from 'components/PredictPage/PredictHero';
// import { WhatIsOlasPredict } from 'components/PredictPage/WhatIsOlasPredict';
import { WhyOlasPredict } from 'components/PredictPage/WhyOlasPredict';
import { GetInvolved } from 'components/PredictPage/GetInvolved';

const Predict = () => (
  <PageWrapper>
    <Meta
      pageTitle="Predict"
      description="On-demand Agent-powered Predictions"
    />

    <PredictHero />
    {/* <WhatIsOlasPredict /> */}
    <WhyOlasPredict />
    <GetInvolved />
  </PageWrapper>
);

export default Predict;
