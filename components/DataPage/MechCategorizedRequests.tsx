import { SUB_HEADER_LG_CLASS, TEXT_MEDIUM_CLASS } from 'common-util/classes';
import { MECH_AGENT_CLASSIFICATION } from 'common-util/constants';
import { mechMarketplaceRequestsPerAgentsQuery } from 'common-util/graphql/queries';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { ExternalLink } from 'components/ui/typography';
import { CodeSnippet } from './CodeSnippet';

const allMechIds = [
  ...MECH_AGENT_CLASSIFICATION.predict,
  ...MECH_AGENT_CLASSIFICATION.contribute,
  ...MECH_AGENT_CLASSIFICATION.governatooor,
];

const MARKETPLACE_QUERY = mechMarketplaceRequestsPerAgentsQuery(allMechIds);

export const MechCategorizedRequestsInfo = () => (
  <SectionWrapper id="mech-requests-categorized">
    <h2 className={SUB_HEADER_LG_CLASS}>Mech Requests (Categorized)</h2>

    <div className="space-y-6 mt-4">
      <p>
        Predict, Contribute, and Governatooorr request counts are computed by summing per-agent
        totals across subgraphs using fixed agent IDs: Predict [
        {MECH_AGENT_CLASSIFICATION.predict.join(', ')}], Contribute [
        {MECH_AGENT_CLASSIFICATION.contribute.join(', ')}], Governatooorr [
        {MECH_AGENT_CLASSIFICATION.governatooor.join(', ')}]. The &quot;Other&quot; bucket is
        computed as <em>Total Requests</em> minus these known categories.
      </p>

      <p>
        The query returns <code>requestsPerAgents</code> (marketplace requests) and{' '}
        <code>requestsPerAgentOnchains</code> (legact mech requests). The requestsCounts from both
        are summed together for the final totals.
      </p>

      <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Mech Marketplace Requests (per agent)</h3>
      <p className="text-purple-600">
        Subgraph links:{' '}
        <ExternalLink
          href={process.env.NEXT_PUBLIC_GNOSIS_MARKETPLACE_SUBGRAPH_URL}
          className="mr-2"
        >
          Gnosis
        </ExternalLink>
        <ExternalLink href={process.env.NEXT_PUBLIC_BASE_MARKETPLACE_SUBGRAPH_URL} className="mr-2">
          Base
        </ExternalLink>
        <ExternalLink
          href={process.env.NEXT_PUBLIC_POLYGON_MARKETPLACE_SUBGRAPH_URL}
          className="mr-2"
        >
          Polygon
        </ExternalLink>
        <ExternalLink href={process.env.NEXT_PUBLIC_OPTIMISM_MARKETPLACE_SUBGRAPH_URL}>
          Optimism
        </ExternalLink>
      </p>
      <CodeSnippet>{MARKETPLACE_QUERY}</CodeSnippet>
    </div>
  </SectionWrapper>
);
