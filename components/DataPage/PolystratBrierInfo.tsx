import { getPolymarketDailyBrierStatsQuery } from 'common-util/graphql/queries';
import { BrierInfo } from './BrierInfo';

export const PolystratBrierInfo = () => (
  <BrierInfo
    id="polystrat-predict-brier"
    title="Polystrat: Predict Brier Score"
    query={getPolymarketDailyBrierStatsQuery({
      date_gte: 0,
      date_lte: 9999999999,
      first: 1000,
      skip: 0,
    })}
    endpoint={process.env.NEXT_PUBLIC_OLAS_POLYMARKET_AGENTS_SQUID_URL}
    dayWord="resolution"
  />
);
