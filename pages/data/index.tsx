import { SCREEN_WIDTH_XL, TITLE_CLASS } from 'common-util/classes';
import { AtaTransactionsInfo } from 'components/DataPage/AtaTransactions';
import { BabydegenMetricsInfo } from 'components/DataPage/BabydegenMetrics';
import { BuildersInfo } from 'components/DataPage/BuildersInfo';
import { DailyActiveAgentsInfo } from 'components/DataPage/DailyActiveAgents';
import { FeesInfo } from 'components/DataPage/Fees';
import { GovernVeOlasInfo } from 'components/DataPage/GovernVeOlasInfo';
import { MechCategorizedRequestsInfo } from 'components/DataPage/MechCategorizedRequests';
import { MechGlobalsInfo } from 'components/DataPage/MechGlobals';
import { MechTurnoverInfo } from 'components/DataPage/MechTurnover';
import { OlasStakedInfo } from 'components/DataPage/OlasStaked';
import { OperatorsInfo } from 'components/DataPage/Operators';
import { OmenstratAccuracyInfo } from 'components/DataPage/OmenstratAccuracy';
import { OmenstratAprInfo } from 'components/DataPage/OmenstratAprInfo';
import { OmenstratRoiInfo } from 'components/DataPage/OmenstratRoiInfo';
import { PolystratAccuracyInfo } from 'components/DataPage/PolystratAccuracy';
import { PolystratAprInfo } from 'components/DataPage/PolystratAprInfo';
import { PolystratRoiInfo } from 'components/DataPage/PolystratRoiInfo';
import { TokenHolders } from 'components/DataPage/TokenHolders';
import { TransactionsInfo } from 'components/DataPage/Transactions';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const DataVerifyPage = () => (
  <PageWrapper>
    <Meta
      pageTitle="Data Verification"
      description="Verify Olas protocol metrics and data. Access detailed information about agents, operators, staking, transactions, and on-chain activity across the Olas ecosystem."
    />
    <div className="p-14 border-b-1.5">
      <h1 className={`${TITLE_CLASS} text-center`}>Data verification</h1>
    </div>
    <div className={`${SCREEN_WIDTH_XL} divide-y divide-dashed divide-gray-200`}>
      <DailyActiveAgentsInfo />
      <BabydegenMetricsInfo />
      <MechGlobalsInfo />
      <MechCategorizedRequestsInfo />
      <TokenHolders />
      <GovernVeOlasInfo />
      <OperatorsInfo />
      <BuildersInfo />
      <TransactionsInfo />
      <AtaTransactionsInfo />
      <MechTurnoverInfo />
      <OlasStakedInfo />
      <OmenstratRoiInfo />
      <OmenstratAprInfo />
      <OmenstratAccuracyInfo />
      <PolystratRoiInfo />
      <PolystratAprInfo />
      <PolystratAccuracyInfo />
      <FeesInfo />
    </div>
    <div className="border-b-1.5" />
  </PageWrapper>
);

export default DataVerifyPage;
