import { SCREEN_WIDTH_XL, TITLE_CLASS } from 'common-util/classes';
import { AtaTransactionsInfo } from 'components/DataPage/AtaTransactions';
import { DailyActiveAgentsInfo } from 'components/DataPage/DailyActiveAgents';
import { FeesInfo } from 'components/DataPage/Fees';
import { MechCategorizedRequestsInfo } from 'components/DataPage/MechCategorizedRequests';
import { MechRequestsInfo } from 'components/DataPage/MechRequests';
import { MechTurnoverInfo } from 'components/DataPage/MechTurnover';
import { OlasStakedInfo } from 'components/DataPage/OlasStaked';
import { OperatorsInfo } from 'components/DataPage/Operators';
import { PredictAccuracyInfo } from 'components/DataPage/PredictAccuracy';
import { PredictAprInfo } from 'components/DataPage/PredictAprInfo';
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
      <MechRequestsInfo />
      <MechCategorizedRequestsInfo />
      <OperatorsInfo />
      <TransactionsInfo />
      <AtaTransactionsInfo />
      <MechTurnoverInfo />
      <OlasStakedInfo />
      <PredictRoiInfo />
      <PredictAprInfo />
      <PredictAccuracyInfo />
      <FeesInfo />
    </div>
    <div className="border-b-1.5" />
  </PageWrapper>
);

export default DataVerifyPage;
