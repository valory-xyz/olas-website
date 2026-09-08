import { SUB_HEADER_LG_CLASS, TEXT_MEDIUM_CLASS } from 'common-util/classes';
import { MECH_FEES_CHAIN_KEYS, MECH_FEES_CHAIN_SCOPE } from 'common-util/constants';
import { MECH_FEES_SUBGRAPH_URLS } from 'common-util/subgraph';
import {
  legacyMechFeesQuery,
  legacyMechFeesTotalsQuery,
  newMechFeesQuery,
  newMechFeesTotalsQuery,
} from 'common-util/graphql/queries';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { SubgraphLink } from './SubgraphLink';
import { CodeSnippet } from './CodeSnippet';

/**
 * One link per mech-fee subgraph, derived from the chain list the paragraph above names.
 * Listing two of the seven by hand is how the prose and the sources came to disagree.
 */
const MechFeesSubgraphLinks = () => (
  <>
    {MECH_FEES_CHAIN_KEYS.map((chain) => (
      <SubgraphLink key={chain} apiUrl={MECH_FEES_SUBGRAPH_URLS[chain]} className="mr-2">
        {chain.charAt(0).toUpperCase() + chain.slice(1)}
      </SubgraphLink>
    ))}
  </>
);

export const MechTurnoverInfo = () => {
  return (
    <SectionWrapper id="mech-turnover">
      <h2 className={SUB_HEADER_LG_CLASS}>Mech Turnover</h2>

      <div className="space-y-6 mt-4">
        <p>
          Tracks the total fees collected from the Mech Marketplace across {MECH_FEES_CHAIN_SCOPE},
          plus legacy mech fees from Gnosis. New mech fees are already in USD, while legacy fees are
          converted from wei to XDAI (treated as 1 USD equivalent) before being summed together to
          provide the total mech marketplace turnover. This is the same figure the Mech economy page
          publishes as &quot;Total Task Payments&quot;.
        </p>

        <p>The following queries aggregate mech fees from every source:</p>

        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>New Mech Marketplace Fees Query</h3>

        <p className="text-purple-600">
          Subgraph links: <MechFeesSubgraphLinks />
        </p>
        <CodeSnippet>{newMechFeesQuery}</CodeSnippet>

        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Legacy Mech Fees Query</h3>

        <p className="text-purple-600">
          Subgraph link:{' '}
          <SubgraphLink apiUrl={process.env.NEXT_PUBLIC_LEGACY_MECH_FEES_GNOSIS_SUBGRAPH_URL}>
            Gnosis
          </SubgraphLink>
        </p>

        <p className="text-sm text-gray-600">
          <strong>Note:</strong> Legacy mech fees are returned in wei and converted to XDAI by
          dividing by 10^18 before being added to the total turnover.
        </p>

        <CodeSnippet>{legacyMechFeesQuery}</CodeSnippet>

        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold mt-6`}>
          Totals (In/Out) Queries Used by Mech fees
        </h3>

        <p>
          These include both in and out totals to compute claimed and unclaimed amounts in the API
          aggregator.
        </p>

        <h4 className="font-semibold">New Mech Fees Totals</h4>
        <p className="text-purple-600">
          Subgraph links: <MechFeesSubgraphLinks />
        </p>
        <CodeSnippet>{newMechFeesTotalsQuery}</CodeSnippet>

        <h4 className="font-semibold">Legacy Mech Fees Totals</h4>
        <p className="text-purple-600">
          Subgraph link:{' '}
          <SubgraphLink apiUrl={process.env.NEXT_PUBLIC_LEGACY_MECH_FEES_GNOSIS_SUBGRAPH_URL}>
            Gnosis
          </SubgraphLink>
        </p>
        <CodeSnippet>{legacyMechFeesTotalsQuery}</CodeSnippet>
      </div>
    </SectionWrapper>
  );
};
