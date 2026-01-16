import { SUB_HEADER_LG_CLASS, TEXT_MEDIUM_CLASS } from 'common-util/classes';
import { AUTONOLAS_SUBGRAPH_URL } from 'common-util/constants';
import { totalBuildersQuery } from 'common-util/graphql/queries';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { ExternalLink } from 'components/ui/typography';
import { CodeSnippet } from './CodeSnippet';

export const BuildersInfo = () => {
  return (
    <SectionWrapper id="builders">
      <h2 className={SUB_HEADER_LG_CLASS}>Builders</h2>

      <div className="space-y-6 mt-4">
        <p>
          Tracks the total number of unique builders who have developed on the Olas Stack. This
          metric represents developers who have created and deployed services or agents on the Olas
          protocol.
        </p>

        <p>The following query is used to fetch the total builders:</p>

        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Total Builders Query</h3>

        <ExternalLink href={AUTONOLAS_SUBGRAPH_URL}>Subgraph link</ExternalLink>
        <CodeSnippet>{totalBuildersQuery}</CodeSnippet>
      </div>
    </SectionWrapper>
  );
};
