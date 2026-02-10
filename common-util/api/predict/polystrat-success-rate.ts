import { polymarketAgentsGraphClient } from 'common-util/graphql/client';
import { executeGraphQLQuery } from 'common-util/graphql/metric-utils';
import { getPolymarketBetsQuery } from 'common-util/graphql/queries';
import { MetricWithStatus, WithMeta } from 'common-util/graphql/types';

const LIMIT = 1000;
const PAGES = 10;

type MarketParticipant = {
  id: string;
  outcomeIndex: number;
  question: {
    id: string;
    resolution: {
      id: string;
      winningIndex: number;
    } | null;
  };
};

type ClosedMarketsResponse = WithMeta<Record<string, MarketParticipant[]>>;

export const fetchPolystratSuccessRate = async (): Promise<MetricWithStatus<string | null>> => {
  return executeGraphQLQuery<ClosedMarketsResponse, string>({
    client: polymarketAgentsGraphClient,
    query: getPolymarketBetsQuery({
      first: LIMIT,
      pages: PAGES,
    }),
    source: 'predict:polygon',
    chain: 'polygon',
    transform: (data) => {
      // Flatten all market participants from paginated query
      const participants = Object.entries(data)
        .filter(([key]) => key !== '_meta' && key !== 'global')
        .flatMap(([, value]) => value as MarketParticipant[]);

      let totalParticipants = 0;
      let wonParticipants = 0;

      // Check each participant
      participants.forEach((participant) => {
        const resolution = participant.question?.resolution;
        // Skip if no resolution
        if (!resolution) return;

        const winningIndex = resolution.winningIndex;
        // Skip if winning index is invalid
        if (winningIndex == null || winningIndex < 0) return;

        totalParticipants += 1;
        if (Number(participant.outcomeIndex) === Number(winningIndex)) {
          wonParticipants += 1;
        }
      });

      if (totalParticipants === 0) return '0';
      return ((wonParticipants / totalParticipants) * 100).toFixed(0);
    },
  });
};
