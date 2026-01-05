import { SUB_HEADER_LG_CLASS, TEXT_MEDIUM_CLASS } from 'common-util/classes';
import { MECH_FEES_SUBGRAPH_DISPLAY_URLS } from 'common-util/constants';
import {
  legacyMechFeesQuery,
  legacyMechFeesTotalsQuery,
  newMechFeesQuery,
  newMechFeesTotalsQuery,
} from 'common-util/graphql/queries';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { ExternalLink } from 'components/ui/typography';
import { CodeSnippet } from './CodeSnippet';

export const MechTurnoverInfo = () => {
  return (
    <SectionWrapper id="mech-turnover">
      <h2 className={SUB_HEADER_LG_CLASS}>Mech Turnover</h2>

      <div className="space-y-6 mt-4">
        <p>
          Tracks the total fees collected from the Mech Marketplace across three
          different sources: new mech fees from Gnosis and Base networks, and
          legacy mech fees from Gnosis. New mech fees are already in USD, while
          legacy fees are converted from wei to XDAI (treated as 1 USD
          equivalent) before being summed together to provide the total mech
          marketplace turnover.
        </p>

        <p>The following queries aggregate mech fees from all three sources:</p>

        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>
          New Mech Marketplace Fees Query
        </h3>

        <p className="text-purple-600">
          Subgraph links:{' '}
          <ExternalLink
            href={MECH_FEES_SUBGRAPH_DISPLAY_URLS.newFeesGnosis}
            className="mr-2"
          >
            Gnosis
          </ExternalLink>
          <ExternalLink
            href={MECH_FEES_SUBGRAPH_DISPLAY_URLS.newFeesBase}
            className="mr-2"
          >
            Base
          </ExternalLink>
        </p>
        <CodeSnippet>{newMechFeesQuery}</CodeSnippet>

        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>
          Legacy Mech Fees Query
        </h3>

        <p className="text-purple-600">
          Subgraph link:{' '}
          <ExternalLink href={MECH_FEES_SUBGRAPH_DISPLAY_URLS.legacyFeesGnosis}>
            Gnosis
          </ExternalLink>
        </p>

        <p className="text-sm text-gray-600">
          <strong>Note:</strong> Legacy mech fees are returned in wei and
          converted to XDAI by dividing by 10^18 before being added to the total
          turnover.
        </p>

        <CodeSnippet>{legacyMechFeesQuery}</CodeSnippet>

        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold mt-6`}>
          Totals (In/Out) Queries Used by Mech fees
        </h3>

        <p>
          These include both in and out totals to compute claimed and unclaimed
          amounts in the API aggregator.
        </p>

        <h4 className="font-semibold">New Mech Fees Totals</h4>
        <p className="text-purple-600">
          Subgraph links:{' '}
          <ExternalLink
            href={MECH_FEES_SUBGRAPH_DISPLAY_URLS.newFeesGnosis}
            className="mr-2"
          >
            Gnosis
          </ExternalLink>
          <ExternalLink
            href={MECH_FEES_SUBGRAPH_DISPLAY_URLS.newFeesBase}
            className="mr-2"
          >
            Base
          </ExternalLink>
        </p>
        <CodeSnippet>{newMechFeesTotalsQuery}</CodeSnippet>

        <h4 className="font-semibold">Legacy Mech Fees Totals</h4>
        <p className="text-purple-600">
          Subgraph link:{' '}
          <ExternalLink href={MECH_FEES_SUBGRAPH_DISPLAY_URLS.legacyFeesGnosis}>
            Gnosis
          </ExternalLink>
        </p>
        <CodeSnippet>{legacyMechFeesTotalsQuery}</CodeSnippet>
      </div>
    </SectionWrapper>
  );
};
