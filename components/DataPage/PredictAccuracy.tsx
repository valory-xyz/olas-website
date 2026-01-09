import { SUB_HEADER_LG_CLASS, TEXT_MEDIUM_CLASS } from 'common-util/classes';
import { getClosedMarketsBetsQuery } from 'common-util/graphql/queries';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { CodeSnippet } from './CodeSnippet';

export const PredictAccuracyInfo = () => {
  const closedMarketsBets = getClosedMarketsBetsQuery({
    first: 1000,
    pages: 10,
  });

  return (
    <SectionWrapper id="predict-accuracy">
      <h2 className={SUB_HEADER_LG_CLASS}>Predict Success Rate</h2>

      <div className="space-y-6 mt-4">
        <p>
          Success rate shows how often your agent&apos;s predictions were
          correct in resolved markets. Bets on unresolved markets or with
          invalid outcomes are excluded, and the rate is based on the
          latest&nbsp;<b>10,000 bets</b>&nbsp;from closed markets to ensure
          performance remains relevant.
        </p>

        <p>The following query is used:</p>

        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>
          Closed Markets Bets query
        </h3>

        <p className="max-w-[800px]">
          Used to fetch all bets along with their outcome and the final answer
          of the associated market
        </p>
        <p className="text-purple-600">
          API endpoint:{' '}
          <code>
            {process.env.NEXT_PUBLIC_OLAS_PREDICT_AGENTS_SUBGRAPH_URL}
          </code>
        </p>
        <p className="text-sm text-gray-600 mt-2">Example curl request:</p>
        <CodeSnippet>
          {`curl -X POST ${process.env.NEXT_PUBLIC_OLAS_PREDICT_AGENTS_SUBGRAPH_URL} \\
  -H "Content-Type: application/json" \\
  -d '{"query": "{ bets(first: 5, where: { fixedProductMarketMaker_: { currentAnswer_not: null } }) { outcomeIndex } }"}'`}
        </CodeSnippet>
        <p className="text-sm text-gray-600 mt-4">GraphQL query:</p>
        <CodeSnippet>{closedMarketsBets}</CodeSnippet>
      </div>
    </SectionWrapper>
  );
};
