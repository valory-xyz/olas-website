import { SUB_HEADER_LG_CLASS, TEXT_MEDIUM_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { ExternalLink } from 'components/ui/typography';
import { CodeSnippet } from './CodeSnippet';

const IDS_LIST = '["14", "25", "13", "6", "5"]';

const ONCHAIN_QUERY = `query {
  requestsPerAgentOnchains(where: { id_in: ${IDS_LIST} }) {
    id
    requestsCount
  }
}`;

const MARKETPLACE_QUERY = `query {
  requestsPerAgents(where: { id_in: ${IDS_LIST} }) {
    id
    requestsCount
  }
}`;

export const MechCategorizedRequestsInfo = () => (
  <SectionWrapper id="mech-requests-categorized">
    <h2 className={SUB_HEADER_LG_CLASS}>Mech Requests (Categorized)</h2>

    <div className="space-y-6 mt-4">
      <p>
        Predict, Contribute, and Governatooorr request counts are computed by
        summing per-agent totals across subgraphs using fixed agent IDs:
        Predict [14, 25, 13], Contribute [6], Governatooorr [5]. The "Other"
        bucket is computed as <em>Total Requests</em> minus these known
        categories.
      </p>

      <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>On-chain Mech Requests (per agent)</h3>
      <p className="text-purple-600">
        Subgraph link:{' '}
        <ExternalLink href={process.env.NEXT_PUBLIC_OLAS_MECH_SUBGRAPH_URL}>
          Mech (on-chain)
        </ExternalLink>
      </p>
      <CodeSnippet>{ONCHAIN_QUERY}</CodeSnippet>

      <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Mech Marketplace Requests (per agent)</h3>
      <p className="text-purple-600">
        Subgraph links:{' '}
        <ExternalLink href={process.env.NEXT_PUBLIC_GNOSIS_MM_SUBGRAPH_URL} className="mr-2">
          Gnosis
        </ExternalLink>
        <ExternalLink href={process.env.NEXT_PUBLIC_BASE_MM_SUBGRAPH_URL}>
          Base
        </ExternalLink>
      </p>
      <CodeSnippet>{MARKETPLACE_QUERY}</CodeSnippet>
    </div>
  </SectionWrapper>
);


