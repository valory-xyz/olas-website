import { SUB_HEADER_LG_CLASS, TEXT_MEDIUM_CLASS } from 'common-util/classes';
import { getOmenBetsByTimeRangeQuery } from 'common-util/graphql/queries';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { CodeSnippet } from './CodeSnippet';

export const OmenstratAccuracyInfo = () => {
  const [copied, setCopied] = useState(false);
  // Example: the 7D window. The accuracy accumulator runs this query across history one
  // day-range at a time, buckets each settled bet on the day it was placed, then sums
  // won/total per window (7D / 30D / 90D / Max).
  const windowedBets = getOmenBetsByTimeRangeQuery({
    first: 1000,
    timestamp_gte: getMidnightUtcTimestampDaysAgo(7),
    timestamp_lt: getMidnightUtcTimestampDaysAgo(0),
  });

  const copyEndpointToClipboard = async () => {
    const url = process.env.NEXT_PUBLIC_OLAS_PREDICT_AGENTS_SUBGRAPH_URL;
    if (url) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <SectionWrapper id="omenstrat-predict-accuracy">
      <h2 className={SUB_HEADER_LG_CLASS}>Omenstrat: Predict Success Rate</h2>

      <div className="space-y-6 mt-4">
        <p>
          Success rate shows how often your agent&apos;s predictions were correct in resolved
          markets. Trades on unresolved markets or with invalid outcomes are excluded. The rate is
          shown per <b>time range</b> (7D / 30D / 90D / Max): each settled bet is counted on the day
          it was <b>placed</b>, and a bet is correct when its outcome matches the market&apos;s
          resolved answer.
        </p>

        <p>The following query is used (example shows the 7-day window):</p>

        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Windowed Bets query</h3>

        <p className="max-w-[800px]">
          Used to fetch settled bets within a time range, along with their outcome and the final
          answer of the associated market
        </p>
        <p className="text-purple-600 flex items-center gap-2 flex-wrap">
          <span>API endpoint:</span>
          <code>{process.env.NEXT_PUBLIC_OLAS_PREDICT_AGENTS_SUBGRAPH_URL}</code>
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
          {`curl -X POST ${process.env.NEXT_PUBLIC_OLAS_PREDICT_AGENTS_SUBGRAPH_URL} \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify({ query: windowedBets })}'`}
        </CodeSnippet>
      </div>
    </SectionWrapper>
  );
};
