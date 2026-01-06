import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';
import { Activity } from 'components/AgentEconomies/PredictPage/Activity';
import { GetInvolved } from 'components/AgentEconomies/PredictPage/GetInvolved';
import { PredictHero } from 'components/AgentEconomies/PredictPage/PredictHero';
import { WhatIsOlasPredict } from 'components/AgentEconomies/PredictPage/WhatIsOlasPredict';

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
