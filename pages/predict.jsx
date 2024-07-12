import Meta from 'components/Meta';
import PageWrapper from 'components/Layout/PageWrapper';
import { WhatIsOlasPredict } from 'components/PredictPage/WhatIsOlasPredict';
import { PredictHero } from 'components/PredictPage/PredictHero';
import { WhyOlasPredict } from 'components/PredictPage/WhyOlasPredict';
import { GetInvolved } from 'components/PredictPage/GetInvolved';

const Predict = () => (
  <PageWrapper>
    {/* TODO */}
    <Meta pageTitle="Predict" description="" />

    <PredictHero />
    <WhatIsOlasPredict />
    <WhyOlasPredict />
    <GetInvolved />
  </PageWrapper>
);

export default Predict;
