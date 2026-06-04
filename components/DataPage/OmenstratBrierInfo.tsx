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
          The Brier score measures how well-calibrated an agent&apos;s predictions are — not just
          whether it was right, but whether the confidence it implied matched reality. It is the
          mean squared error between the market-implied probability of the outcome the agent bought
          (its prediction) and what actually happened (<b>1</b> if that outcome won, <b>0</b> if it
          lost, or <b>0.5</b> for markets that resolve invalid). <b>Lower is better:</b> 0 is a
          perfect forecast, ~0.25 is no better than a 50/50 guess, and 1 is maximally wrong.
        </p>

        <p>
          Only <b>buy</b> trades on <b>settled</b> markets are scored — sells rebalance a position
          rather than express a prediction, so they are excluded. Each bet&apos;s implied
          probability is captured at trade time, and its squared error is accumulated on the day its
          market resolves.
        </p>

        <p>
          The subgraph stores these as per-day accumulators (<code>brierSum</code>,{' '}
          <code>brierCount</code>). The score shown for a period is the count-weighted mean over
          that window — <code>sum(brierSum) / sum(brierCount)</code> (1e18-scaled) — so the 7D / 30D
          / 90D / Max tabs simply sum the daily buckets over the corresponding range.
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
