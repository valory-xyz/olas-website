import { SUB_HEADER_LG_CLASS, TEXT_MEDIUM_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { CodeSnippet } from './CodeSnippet';

type BrierInfoProps = {
  /** Anchor the Brier tile links to, e.g. `omenstrat-predict-brier`. */
  id: string;
  /** Section heading; must match its `datasets.ts` entry verbatim. */
  title: string;
  /** The platform's daily-Brier query, already stringified. */
  query: string;
  /** The endpoint that query runs against. */
  endpoint: string;
  /**
   * What the source calls the day Brier is credited on: Omen resolves through
   * Realitio ("settlement"), the Polymarket squid through UMA/NegRisk ("resolution").
   */
  dayWord: 'settlement' | 'resolution';
};

/**
 * Provenance for a platform's Brier score. Both platforms compute Brier the same way
 * from the same field names, so they share this section and can't drift apart — only
 * the query, endpoint, anchor and wording differ.
 */
export const BrierInfo = ({ id, title, query, endpoint, dayWord }: BrierInfoProps) => {
  const [copied, setCopied] = useState(false);

  const copyEndpointToClipboard = async () => {
    if (endpoint) {
      await navigator.clipboard.writeText(endpoint);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <SectionWrapper id={id}>
      <h2 className={SUB_HEADER_LG_CLASS}>{title}</h2>

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
          making a prediction, so sells are excluded. Each time range (7D / 30D / 90D / 1Y) averages
          the trades whose markets resolved within that period.
        </p>

        <p>The following query is used:</p>

        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Daily Brier statistics query</h3>

        <p className="max-w-[800px]">
          Used to fetch the per-day Brier accumulators across all trader agents, summed by {dayWord}{' '}
          day
        </p>
        <p className="text-purple-600 flex items-center gap-2 flex-wrap">
          <span>API endpoint:</span>
          <code>{endpoint}</code>
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
          {`curl -X POST ${endpoint} \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify({ query })}'`}
        </CodeSnippet>
      </div>
    </SectionWrapper>
  );
};
