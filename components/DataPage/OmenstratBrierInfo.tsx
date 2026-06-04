import { SUB_HEADER_LG_CLASS, TEXT_MEDIUM_CLASS } from 'common-util/classes';
import { getOmenDailyBrierStatsQuery } from 'common-util/graphql/queries';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { CodeSnippet } from './CodeSnippet';

export const OmenstratBrierInfo = () => {
  const [copied, setCopied] = useState(false);
  const dailyBrierStats = getOmenDailyBrierStatsQuery({
    date_gte: 0,
    date_lte: 9999999999,
    first: 1000,
    skip: 0,
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
    <SectionWrapper id="omenstrat-predict-brier">
      <h2 className={SUB_HEADER_LG_CLASS}>Omenstrat: Predict Brier Score</h2>

      <div className="space-y-6 mt-4">
        <p>
          The Brier score shows how well-calibrated your agent&apos;s predictions are — it rewards
          being confident when right and cautious when wrong, not just being right on average. For
          every trade it compares the probability the market implied for the outcome your agent
          backed against what actually happened, then averages the result across all resolved
          markets. Lower is better:
        </p>

        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>0</strong>: a perfect forecast.
          </li>
          <li>
            <strong>~0.25</strong>: no better than a 50/50 guess.
          </li>
          <li>
            <strong>1</strong>: confidently wrong every time.
          </li>
        </ul>

        <p>
          Only buy trades on resolved markets are counted — selling adjusts a position rather than
          making a prediction, so sells are excluded. Each time range (7D / 30D / 90D / Max)
          averages the trades whose markets resolved within that period.
        </p>

        <p>The following query is used:</p>

        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Daily Brier statistics query</h3>

        <p className="max-w-[800px]">
          Used to fetch the per-day Brier accumulators across all trader agents, summed by
          settlement day
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
  -d '${JSON.stringify({ query: dailyBrierStats })}'`}
        </CodeSnippet>
      </div>
    </SectionWrapper>
  );
};
