import { getSnapshot } from 'common-util/snapshot-storage';
import { Activity } from 'components/AgentEconomies/PredictPage/Activity';
import { GetInvolved } from 'components/AgentEconomies/PredictPage/GetInvolved';
import { PredictHero } from 'components/AgentEconomies/PredictPage/PredictHero';
import { WhatIsOlasPredict } from 'components/AgentEconomies/PredictPage/WhatIsOlasPredict';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const Predict = ({ metrics }) => (
  <PageWrapper>
    <Meta
      pageTitle="Predict"
      description="On-demand Agent-powered Predictions"
    />

    <PredictHero />
    <Activity metrics={metrics} />
    <WhatIsOlasPredict />
    <GetInvolved />
  </PageWrapper>
);

export const getStaticProps = async () => {
  const snapshot = await getSnapshot({ category: 'predict' });
  const metrics = snapshot?.data || null;

  return {
    props: {
      metrics,
    },
    revalidate: 3600, // Revalidate every hour
  };
};

export default Predict;
