import { SUB_HEADER_LG_CLASS, TEXT_MEDIUM_CLASS } from 'common-util/classes';
import { CONNECT_AGENT_ID, CONNECT_CHAINS } from 'common-util/constants';
import {
  getAgentMarketplaceRequestsQuery,
  getAgentMarketplaceRequestsSquidQuery,
  getAgentServicesPageQuery,
  getAgentServicesPageSquidQuery,
  getConnectRegistryQuery,
  getConnectRegistrySquidQuery,
} from 'common-util/graphql/queries';
import {
  MARKETPLACE_SQUID_URLS,
  MARKETPLACE_SUBGRAPH_URLS,
  REGISTRY_SQUID_URLS,
  REGISTRY_SUBGRAPH_URLS,
} from 'common-util/indexers';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { CodeSnippet } from './CodeSnippet';
import { IndexerLinks } from './IndexerLinks';

const chains = [...CONNECT_CHAINS];

// The fetcher inlines midnight UTC 8 days ago and today; shown here as named placeholders.
const registryQueryArgs = {
  agentId: CONNECT_AGENT_ID,
  timestamp_gt: '$midnightUtc8DaysAgo',
  timestamp_lt: '$midnightUtcToday',
};
const marketplaceQueryArgs = { agentId: CONNECT_AGENT_ID };
// The fetcher pages with an id cursor, starting from the empty string.
const servicesQueryArgs = { agentId: CONNECT_AGENT_ID, id_gt: '' };

export const ConnectMetricsInfo = () => (
  <SectionWrapper id="connect-metrics">
    <h2 className={SUB_HEADER_LG_CLASS}>Connect Metrics</h2>

    <div className="space-y-6 mt-4">
      <p>
        Every Connect agent is an Olas service registered under agent ID {CONNECT_AGENT_ID}, on
        Gnosis, Polygon or Robinhood Chain. Its service Safe is its on-chain identity: it executes
        the agent&apos;s transactions and sends its Olas Marketplace requests. The Connect economy
        page shows four values, each summed across the three chains:
      </p>
      <ul className="list-disc list-inside space-y-2">
        <li>
          <strong>Daily Active Agents (DAAs)</strong> is the sum of{' '}
          <code>dailyAgentPerformances.activeMultisigCount</code> over the last 7 complete UTC days,
          divided by 7: the average number of Connect Safes that executed at least one transaction
          per day. An agent runs on one chain, so no Safe is counted twice.
        </li>
        <li>
          <strong>Total Agents</strong> counts the services whose <code>agentIds</code> include
          agent ID {CONNECT_AGENT_ID}: every Connect agent ever set up, whether or not still
          running. The services are paged 1,000 at a time by id.
        </li>
        <li>
          <strong>Olas Marketplace requests</strong> is <code>requestsPerAgents.requestsCount</code>{' '}
          for agent ID {CONNECT_AGENT_ID}: all requests sent to the Olas Marketplace by Connect
          services since launch.
        </li>
        <li>
          <strong>Successful on-chain executions</strong> is <code>agentPerformances.txCount</code>{' '}
          for agent ID {CONNECT_AGENT_ID}: every <code>ExecutionSuccess</code> event emitted by a
          Connect Safe since launch. It counts transactions the Safe executed without reverting, and
          leaves out transactions an agent sends directly from its signing key.
        </li>
      </ul>
      <p>
        Gnosis and Polygon are read from The Graph subgraphs and Robinhood Chain from SQD squids,
        with the same entities in both.
      </p>

      <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Registry Query (DAAs and executions)</h3>
      <p className="text-purple-600">
        Subgraph links: <IndexerLinks urls={REGISTRY_SUBGRAPH_URLS} chains={chains} />
      </p>
      <CodeSnippet>{getConnectRegistryQuery(registryQueryArgs)}</CodeSnippet>
      <p className="text-purple-600">
        Squid links: <IndexerLinks urls={REGISTRY_SQUID_URLS} chains={chains} />
      </p>
      <CodeSnippet>{getConnectRegistrySquidQuery(registryQueryArgs)}</CodeSnippet>

      <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Registry Services Query (Total Agents)</h3>
      <p className="text-purple-600">
        Subgraph links: <IndexerLinks urls={REGISTRY_SUBGRAPH_URLS} chains={chains} />
      </p>
      <CodeSnippet>{getAgentServicesPageQuery(servicesQueryArgs)}</CodeSnippet>
      <p className="text-purple-600">
        Squid links: <IndexerLinks urls={REGISTRY_SQUID_URLS} chains={chains} />
      </p>
      <CodeSnippet>{getAgentServicesPageSquidQuery(servicesQueryArgs)}</CodeSnippet>

      <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Marketplace Requests Query</h3>
      <p className="text-purple-600">
        Subgraph links: <IndexerLinks urls={MARKETPLACE_SUBGRAPH_URLS} chains={chains} />
      </p>
      <CodeSnippet>{getAgentMarketplaceRequestsQuery(marketplaceQueryArgs)}</CodeSnippet>
      <p className="text-purple-600">
        Squid links: <IndexerLinks urls={MARKETPLACE_SQUID_URLS} chains={chains} />
      </p>
      <CodeSnippet>{getAgentMarketplaceRequestsSquidQuery(marketplaceQueryArgs)}</CodeSnippet>
    </div>
  </SectionWrapper>
);
