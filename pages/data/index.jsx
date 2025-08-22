import { SCREEN_WIDTH_XL, TITLE_CLASS } from 'common-util/classes';
import { DailyActiveAgentsInfo } from 'components/DataPage/DailyActiveAgents';
import { FeesInfo } from 'components/DataPage/Fees';
import { OlasStakedInfo } from 'components/DataPage/OlasStaked';
import { PredictAccuracyInfo } from 'components/DataPage/PredictAccuracy';
import { PredictRoiInfo } from 'components/DataPage/PredictRoiInfo';
import { TransactionsInfo } from 'components/DataPage/Transactions';
import PageWrapper from 'components/Layout/PageWrapper';

const DataVerifyPage = () => (
  <PageWrapper>
    <div className="p-14 border-b-1.5">
      <h1 className={`${TITLE_CLASS} text-center`}>Data verification</h1>
    </div>
    <div
      className={`${SCREEN_WIDTH_XL} divide-y divide-dashed divide-gray-200`}
    >
      <DailyActiveAgentsInfo />
      <TransactionsInfo />
      <OlasStakedInfo />
      <PredictRoiInfo />
      <PredictAccuracyInfo />
      <FeesInfo />
    </div>
    <div className="border-b-1.5" />
  </PageWrapper>
);

export default DataVerifyPage;
