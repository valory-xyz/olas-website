import { getOmenDailyBrierStatsQuery } from 'common-util/graphql/queries';
import { BrierInfo } from './BrierInfo';

export const OmenstratBrierInfo = () => (
  <BrierInfo
    id="omenstrat-predict-brier"
    title="Omenstrat: Predict Brier Score"
    query={getOmenDailyBrierStatsQuery({
      date_gte: 0,
      date_lte: 9999999999,
      first: 1000,
      skip: 0,
    })}
    endpoint={process.env.NEXT_PUBLIC_OLAS_PREDICT_AGENTS_SUBGRAPH_URL}
    dayWord="settlement"
  />
);
