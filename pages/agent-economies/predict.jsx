import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';
import { Activity } from 'components/PredictPage/Activity';
import { GetInvolved } from 'components/PredictPage/GetInvolved';
import { PredictHero } from 'components/PredictPage/PredictHero';
import { WhatIsOlasPredict } from 'components/PredictPage/WhatIsOlasPredict';

const Predict = () => (
  <PageWrapper>
    <Meta
      pageTitle="Predict"
      description="On-demand Agent-powered Predictions"
    />

    <PredictHero />
    <Activity />
    <WhatIsOlasPredict />
    <GetInvolved />
  </PageWrapper>
);

export default Predict;
