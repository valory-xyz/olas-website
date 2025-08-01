import { SCREEN_WIDTH_XL, TITLE_CLASS } from 'common-util/classes';
import { PredictAccuracyInfo } from 'components/DataPage/PredictAccuracy';
import { PredictRoiInfo } from 'components/DataPage/PredictRoiInfo';
import PageWrapper from 'components/Layout/PageWrapper';

const Divider = () => <div className="border-b-1.5" />;

const DataVerifyPage = () => (
  <PageWrapper>
    <div className="p-14 border-b-1.5">
      <h1 className={`${TITLE_CLASS} text-center`}>Data verification</h1>
    </div>
    <div
      className={`${SCREEN_WIDTH_XL} divide-y divide-dashed divide-gray-200`}
    >
      <PredictRoiInfo />
      <PredictAccuracyInfo />
    </div>
    <div className="border-b-1.5" />
  </PageWrapper>
);

export default DataVerifyPage;
