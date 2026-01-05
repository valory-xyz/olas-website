import { SUB_HEADER_LG_CLASS, TEXT_MEDIUM_CLASS } from 'common-util/classes';
import {
  PREDICT_MARKET_DURATION_DAYS,
  STAKING_SUBGRAPH_URLS,
} from 'common-util/constants';
import { getSubgraphExplorerUrl } from 'common-util/subgraph';
import {
  getMarketsAndBetsQuery,
  getMechRequestsQuery,
  stakingGlobalsQuery,
  totalMechRequestsQuery,
} from 'common-util/graphql/queries';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { ExternalLink } from 'components/ui/typography';
import { CodeSnippet } from './CodeSnippet';

export const PredictRoiInfo = () => {
  const marketOpenTimestamp = getMidnightUtcTimestampDaysAgo(
    PREDICT_MARKET_DURATION_DAYS,
  );
  const totalMechRequests = totalMechRequestsQuery;
  const marketsAndBets = getMarketsAndBetsQuery(marketOpenTimestamp);
  const stakingGlobals = stakingGlobalsQuery;
  const mechRequests = getMechRequestsQuery({
    timestamp_gt: marketOpenTimestamp,
    first: 1000,
    skip: 0,
    pages: 10,
  });

  return (
    <SectionWrapper id="predict-roi">
      <h2 className={SUB_HEADER_LG_CLASS}>Predict ROI</h2>

      <div className="space-y-6 mt-4">
        <p>
          Total ROI shows your agent&apos;s overall earnings, including profits
          from predictions and staking rewards, minus all related costs such as
          bet amounts, gas fees, and Mech request fees. Requests made for
          unresolved (open) markets are excluded to ensure accuracy.
        </p>

        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>Partial ROI</strong>: profit from prediction markets only.
          </li>
          <li>
            <strong>Final ROI</strong>: includes staking rewards (OLAS converted
            to USD).
          </li>
        </ul>

        <p>The following queries are used to define the value:</p>

        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>
          1) Mech Requests query
        </h3>

        <div className="max-w-[800px]">
          <span className="block mb-2">Used for getting:</span>
          <ul className="list-decimal list-inside space-y-1">
            <li>
              Total mech requests for all markets, including closed and open
            </li>
            <li>
              All requests with question titles in order to use further to
              subtract those done for open markets
            </li>
          </ul>
        </div>
        <ExternalLink href={process.env.NEXT_PUBLIC_OLAS_MECH_SUBGRAPH_URL}>
          Subgraph link
        </ExternalLink>
        <CodeSnippet>
          {totalMechRequests} {mechRequests}
        </CodeSnippet>

        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>
          2) Markets & Bets Query
        </h3>

        <div className="max-w-[800px]">
          <span className="block mb-2">Used for getting:</span>
          <ul className="list-decimal list-inside space-y-1">
            <li>
              All open markets, needed in order to understand which markets are
              open and use it to subtract needed amount of mech requests from
              the total
            </li>
            <li>Cumulative payout, trades amounts and fees for open markets</li>
          </ul>
        </div>
        <ExternalLink
          href={getSubgraphExplorerUrl(
            process.env.NEXT_PUBLIC_OLAS_PREDICT_AGENTS_SUBGRAPH_URL,
          )}
        >
          Subgraph link
        </ExternalLink>
        <CodeSnippet>{marketsAndBets}</CodeSnippet>

        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>
          3) Staking Globals query
        </h3>

        <p>Used for getting cumulative staking rewards in OLAS</p>
        <ExternalLink href={STAKING_SUBGRAPH_URLS.gnosis}>
          Subgraph link
        </ExternalLink>
        <CodeSnippet>{stakingGlobals}</CodeSnippet>
      </div>
    </SectionWrapper>
  );
};
