import { SCREEN_WIDTH_XL, TITLE_CLASS } from 'common-util/classes';
import { getSiteUrl } from 'common-util/getSiteUrl';
import { buildDataCatalog } from 'common-util/structured-data';
import { DATASETS } from 'components/DataPage/datasets';
import { JsonLd } from 'components/JsonLd';
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
import {
  ProtocolFeesInfo,
  ProtocolOwnedLiquidityInfo,
} from 'components/DataPage/ProtocolOwnedLiquidity';
import { OperatorsInfo } from 'components/DataPage/Operators';
import { OmenstratAccuracyInfo } from 'components/DataPage/OmenstratAccuracy';
import { OmenstratAprInfo } from 'components/DataPage/OmenstratAprInfo';
import { OmenstratBrierInfo } from 'components/DataPage/OmenstratBrierInfo';
import { OmenstratRoiInfo } from 'components/DataPage/OmenstratRoiInfo';
import { PolystratAccuracyInfo } from 'components/DataPage/PolystratAccuracy';
import { PolystratAprInfo } from 'components/DataPage/PolystratAprInfo';
import { PolystratBrierInfo } from 'components/DataPage/PolystratBrierInfo';
import { PolystratRoiInfo } from 'components/DataPage/PolystratRoiInfo';
import { PredictTotalAgentsInfo } from 'components/DataPage/PredictTotalAgents';
import { TokenHolders } from 'components/DataPage/TokenHolders';
import { TransactionsInfo } from 'components/DataPage/Transactions';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

// Every section below, as a Dataset record whose `@id` is the section's anchor — the
// same `/data#…` link each metric tile carries. Cited statistics are the strongest
// measured lever for being quoted by generative engines; this is the citation target.
const DATA_CATALOG = buildDataCatalog({ siteUrl: getSiteUrl(), datasets: DATASETS });

const DataVerifyPage = () => (
  <PageWrapper>
    <JsonLd data={DATA_CATALOG} />
    <Meta
      pageTitle="Data Verification"
      description="Verify Olas protocol metrics and data. Access detailed information about agents, operators, staking, transactions, and on-chain activity across the Olas ecosystem."
    />
    <div className="p-14 border-b-1.5">
      <h1 className={`${TITLE_CLASS} text-center`}>Data verification</h1>
    </div>
    <div className={`${SCREEN_WIDTH_XL} divide-y divide-dashed divide-gray-200`}>
      <DailyActiveAgentsInfo />
      <PredictTotalAgentsInfo />
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
      <OmenstratBrierInfo />
      <PolystratRoiInfo />
      <PolystratAprInfo />
      <PolystratAccuracyInfo />
      <PolystratBrierInfo />
      <ProtocolOwnedLiquidityInfo />
      <ProtocolFeesInfo />
      <FeesInfo />
    </div>
    <div className="border-b-1.5" />
  </PageWrapper>
);

export default DataVerifyPage;
