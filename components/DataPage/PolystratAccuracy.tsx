import { SUB_HEADER_LG_CLASS, TEXT_MEDIUM_CLASS } from 'common-util/classes';
import { getPolymarketBetsQuery } from 'common-util/graphql/queries';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { CodeSnippet } from './CodeSnippet';

export const PolystratAccuracyInfo = () => {
  const [copied, setCopied] = useState(false);
  const polymarketBets = getPolymarketBetsQuery({
    first: 1000,
    pages: 10,
  });

  const copyEndpointToClipboard = async () => {
    const url = process.env.NEXT_PUBLIC_OLAS_POLYMARKET_AGENTS_SUBGRAPH_URL;
    if (url) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <SectionWrapper id="polystrat-predict-accuracy">
      <h2 className={SUB_HEADER_LG_CLASS}>Polystrat: Predict Success Rate</h2>

      <div className="space-y-6 mt-4">
        <p>
          Success rate shows how often your agent&apos;s predictions were correct in resolved
          markets. Bets on unresolved markets or with invalid outcomes are excluded, and the rate is
          based on the latest <b>10,000 bets</b> from resolved markets to ensure performance remains
          relevant.
        </p>

        <p>The following query is used:</p>

        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Polymarket Bets query</h3>

        <p className="max-w-[800px]">
          Used to fetch all bets along with their outcome index and the resolution of the associated
          market question
        </p>
        <p className="text-purple-600 flex items-center gap-2 flex-wrap">
          <span>API endpoint:</span>
          <code>{process.env.NEXT_PUBLIC_OLAS_POLYMARKET_AGENTS_SUBGRAPH_URL}</code>
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
          {`curl -X POST ${process.env.NEXT_PUBLIC_OLAS_POLYMARKET_AGENTS_SUBGRAPH_URL} \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify({ query: polymarketBets })}'`}
        </CodeSnippet>
      </div>
    </SectionWrapper>
  );
};
