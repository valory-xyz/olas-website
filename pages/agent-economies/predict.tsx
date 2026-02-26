import {
  computeAllRangeHistograms,
  AgentBlueprintRoiData,
} from 'common-util/api/predict/roi-distribution';
import { REVALIDATE_DURATION } from 'common-util/constants';
import { getSnapshot } from 'common-util/snapshot-storage';
import { Activity } from 'components/AgentEconomies/PredictPage/Activity';
import { GetInvolved } from 'components/AgentEconomies/PredictPage/GetInvolved';
import { PredictHero } from 'components/AgentEconomies/PredictPage/PredictHero';
import { WhatIsOlasPredict } from 'components/AgentEconomies/PredictPage/WhatIsOlasPredict';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const Predict = ({ metrics, roiDistribution, toolAccuracy }) => (
  <PageWrapper>
    <Meta pageTitle="Predict" description="On-demand Agent-powered Predictions" />

    <PredictHero />
    <Activity metrics={metrics} roiDistribution={roiDistribution} toolAccuracy={toolAccuracy} />
    <WhatIsOlasPredict />
    <GetInvolved />
  </PageWrapper>
);

export const getStaticProps = async () => {
  const [snapshot, omenRoiSnapshot, polyRoiSnapshot, toolAccuracySnapshot] = await Promise.all([
    getSnapshot({ category: 'predict' }),
    getSnapshot({ category: 'roi-distribution/omenstrat-main' }),
    getSnapshot({ category: 'roi-distribution/polystrat-main' }),
    getSnapshot({ category: 'predict-tool-accuracy' }),
  ]);

  const metrics = snapshot?.data || null;
  const toolAccuracy = (toolAccuracySnapshot?.data as any) || null;

  let roiDistribution = null;
  if (omenRoiSnapshot?.data || polyRoiSnapshot?.data) {
    try {
      roiDistribution = computeAllRangeHistograms(
        (omenRoiSnapshot?.data as unknown as AgentBlueprintRoiData) ?? null,
        (polyRoiSnapshot?.data as unknown as AgentBlueprintRoiData) ?? null
      );
    } catch (e) {
      console.error('Failed to compute ROI distribution histograms', e);
    }
  }

  return {
    props: {
      metrics,
      roiDistribution,
      toolAccuracy,
    },
    revalidate: REVALIDATE_DURATION,
  };
};

export default Predict;
