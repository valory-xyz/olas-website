import { CACHE_DURATION_SECONDS } from 'common-util/constants';
import { predictAgentsGraphClient } from 'common-util/graphql/client';
import { getClosedMarketsBetsQuery } from 'common-util/graphql/queries';

const LIMIT = 1000;
const PAGES = 10;
const INVALID_ANSWER_HEX =
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

const fetchSuccessRate = async () => {
  try {
    const closedMarketsBetsResult = await predictAgentsGraphClient.request(
      getClosedMarketsBetsQuery({ first: LIMIT, pages: PAGES }),
    );

    const closedMarketsBets = Object.values(closedMarketsBetsResult).flat();

    const totalBets = closedMarketsBets.length;
    // Calculate amount of won bets
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
  } catch (error) {
    throw error;
  }
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  res.setHeader(
    'Vercel-CDN-Cache-Control',
    `s-maxage=${CACHE_DURATION_SECONDS}`,
  );
  res.setHeader('CDN-Cache-Control', `s-maxage=${CACHE_DURATION_SECONDS}`);
  res.setHeader(
    'Cache-Control',
    `public, s-maxage=${CACHE_DURATION_SECONDS}, stale-while-revalidate=${CACHE_DURATION_SECONDS * 2}`,
  );

  try {
    const successRate = await fetchSuccessRate();

    if (successRate === null || successRate === undefined) {
      return res.status(500).json({ message: 'Failed to fetch success rate' });
    }

    return res.status(200).json({ successRate });
  } catch (error) {
    console.error('Error in handler:', error);
    return res.status(500).json({ message: 'Failed to fetch success rate' });
  }
}
