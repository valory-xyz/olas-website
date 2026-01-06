import { SUB_HEADER_LG_CLASS, TEXT_MEDIUM_CLASS } from 'common-util/classes';
import { getClosedMarketsBetsQuery } from 'common-util/graphql/queries';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { ExternalLink } from 'components/ui/typography';
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
        <ExternalLink
          href={process.env.NEXT_PUBLIC_OLAS_PREDICT_AGENTS_SUBGRAPH_URL}
        >
          Subgraph link
        </ExternalLink>
        <CodeSnippet>{closedMarketsBets}</CodeSnippet>
      </div>
    </SectionWrapper>
  );
};
