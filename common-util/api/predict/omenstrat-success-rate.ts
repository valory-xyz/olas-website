import { predictAgentsGraphClient } from 'common-util/graphql/client';
import { executeGraphQLQuery } from 'common-util/graphql/metric-utils';
import { getClosedMarketsBetsQuery } from 'common-util/graphql/queries';
import { MetricWithStatus, WithMeta } from 'common-util/graphql/types';

const LIMIT = 1000;
const PAGES = 10;
const INVALID_ANSWER_HEX = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

type ClosedMarketsBetsResponse = WithMeta<Record<string, any[]>>;

export const fetchOmenstratSuccessRate = async (): Promise<MetricWithStatus<string | null>> => {
  return executeGraphQLQuery<ClosedMarketsBetsResponse, string>({
    client: predictAgentsGraphClient,
    query: getClosedMarketsBetsQuery({
      first: LIMIT,
      pages: PAGES,
    }),
    source: 'predict:gnosis',
    chain: 'gnosis',
    transform: (data) => {
      const closedMarketsBets = Object.entries(data)
        .filter(([key]) => key !== '_meta')
        .flatMap(([, value]) => value) as any[];

      const totalBets = closedMarketsBets.length;
      let wonBets = 0;

      closedMarketsBets.forEach((bet) => {
        const marketAnswer = bet.fixedProductMarketMaker.currentAnswer;
        const betAnswer = bet.outcomeIndex;
        if (marketAnswer === INVALID_ANSWER_HEX) return;
        if (Number(marketAnswer) === Number(betAnswer)) {
          wonBets += 1;
        }
      });

      return ((wonBets / totalBets) * 100).toFixed(0);
    },
  });
};
