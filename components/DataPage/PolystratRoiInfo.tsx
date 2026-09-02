import { SUB_HEADER_LG_CLASS, TEXT_MEDIUM_CLASS } from 'common-util/classes';
import { PREDICT_MARKET_DURATION_DAYS } from 'common-util/constants';
import {
  getMechRequestsQuery,
  getPolymarketDailyProfitStatsQuery,
  getPolymarketTraderAgentsQuery,
  getStakingRewardsByTimeRangeQuery,
  totalMechRequestsQuery,
} from 'common-util/graphql/queries';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { SubgraphLink } from './SubgraphLink';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { CodeSnippet } from './CodeSnippet';

export const PolystratRoiInfo = () => {
  const [copied, setCopied] = useState(false);
  const marketOpenTimestamp = getMidnightUtcTimestampDaysAgo(PREDICT_MARKET_DURATION_DAYS);
  const totalMechRequests = totalMechRequestsQuery;
  const dailyProfitStats = getPolymarketDailyProfitStatsQuery({
    date_gte: getMidnightUtcTimestampDaysAgo(7),
    date_lte: getMidnightUtcTimestampDaysAgo(1),
    first: 1000,
    skip: 0,
  });
  const traderAgents = getPolymarketTraderAgentsQuery({ first: 1000, skip: 0 });
  const stakingRewards = getStakingRewardsByTimeRangeQuery({
    first: 1000,
    contractAddresses: ['<predict staking contracts on Polygon>'],
    timestamp_gte: getMidnightUtcTimestampDaysAgo(7),
    timestamp_lt: getMidnightUtcTimestampDaysAgo(0),
  });
  const mechRequests = getMechRequestsQuery({
    timestamp_gt: marketOpenTimestamp,
    first: 1000,
    skip: 0,
    pages: 10,
  });

  const copyEndpointToClipboard = async () => {
    const url = process.env.NEXT_PUBLIC_OLAS_POLYMARKET_AGENTS_SQUID_URL;
    if (url) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <SectionWrapper id="polystrat-predict-roi">
      <h2 className={SUB_HEADER_LG_CLASS}>Polystrat: Predict ROI</h2>

      <div className="space-y-6 mt-4">
        <p>
          Total ROI shows your agent&apos;s overall earnings, including profits from predictions and
          staking rewards, minus all related costs such as trade amounts, gas fees, and Mech request
          fees. Requests made for unresolved (open) markets are excluded to ensure accuracy. ROI is
          shown per <b>time range</b> (7D / 30D / 90D / Max): prediction profit and costs are
          aggregated per window from per-agent daily statistics, and staking rewards are summed over
          the same window (the Polygon staking subgraph indexes predict programs only) and valued at
          the current OLAS/USD price.
        </p>

        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>Trading ROI</strong> (shown on the page): profit from prediction markets only.
          </li>
          <li>
            <strong>Total ROI</strong> (shown in the tooltip): includes staking rewards (OLAS
            converted to USD).
          </li>
        </ul>

        <p>The following queries are used to define the value:</p>

        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>1) Mech Requests query</h3>

        <div className="max-w-[800px]">
          <span className="block mb-2">Used for getting:</span>
          <ul className="list-decimal list-inside space-y-1">
            <li>Total mech requests for all markets, including closed and open</li>
            <li>
              All requests with question titles in order to use further to subtract those done for
              open markets
            </li>
          </ul>
        </div>
        <p className="text-purple-600">
          Subgraph link:{' '}
          <SubgraphLink apiUrl={process.env.NEXT_PUBLIC_POLYGON_MARKETPLACE_SUBGRAPH_URL}>
            Polygon
          </SubgraphLink>
        </p>
        <CodeSnippet>
          {totalMechRequests} {mechRequests}
        </CodeSnippet>

        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>2) Trading Data Queries</h3>

        <div className="max-w-[800px]">
          <span className="block mb-2">Used for getting:</span>
          <ul className="list-decimal list-inside space-y-1">
            <li>
              Per-agent daily statistics (example shows the 7-day window): daily profit, payouts,
              and the settled cost basis that windowed ROI divides by
            </li>
            <li>
              Lifetime per-agent totals for the Max window: settled volume and expected payouts
              (booked when a market resolves — redemption is never waited for)
            </li>
          </ul>
        </div>
        <p className="text-purple-600 flex items-center gap-2 flex-wrap">
          <span>API endpoint:</span>
          <code>{process.env.NEXT_PUBLIC_OLAS_POLYMARKET_AGENTS_SQUID_URL}</code>
          <button
            onClick={copyEndpointToClipboard}
            className="p-1 border rounded-md border-slate-300 hover:bg-slate-100 transition-colors"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check size={16} className="text-green-600" />
            ) : (
              <Copy size={16} color="black" />
            )}
          </button>
        </p>
        <CodeSnippet>
          {`curl -X POST ${process.env.NEXT_PUBLIC_OLAS_POLYMARKET_AGENTS_SQUID_URL} \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify({ query: dailyProfitStats })}'`}
        </CodeSnippet>
        <CodeSnippet>
          {`curl -X POST ${process.env.NEXT_PUBLIC_OLAS_POLYMARKET_AGENTS_SQUID_URL} \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify({ query: traderAgents })}'`}
        </CodeSnippet>

        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>3) Staking Rewards query</h3>

        <p className="max-w-[800px]">
          Used for getting staking rewards (in OLAS) within a time range (example shows the 7-day
          window). The windowed sum is valued at the current OLAS/USD price for Final ROI.
        </p>
        <p className="text-purple-600">
          Subgraph link:{' '}
          <SubgraphLink apiUrl={process.env.NEXT_PUBLIC_POLYGON_STAKING_SUBGRAPH_URL}>
            Polygon
          </SubgraphLink>
        </p>
        <CodeSnippet>{stakingRewards}</CodeSnippet>
      </div>
    </SectionWrapper>
  );
};
