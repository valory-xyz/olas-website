import { SUB_HEADER_LG_CLASS, TEXT_MEDIUM_CLASS } from 'common-util/classes';
import {
  AUTONOLAS_BASE_SUBGRAPH_URL,
  OMENSTRAT_AGENT_CLASSIFICATION,
  POLYSTRAT_AGENT_CLASSIFICATION,
  REGISTRY_SUBGRAPH_URLS,
} from 'common-util/constants';
import {
  dailyActivitiesQuery,
  dailyAgentPerformancesQuery,
  dailyAgentsFunPerformancesQuery,
  dailyBabydegenPerformancesQuery,
  dailyMechAgentPerformancesQuery,
  dailyPredictAgentsPerformancesQuery,
} from 'common-util/graphql/queries';
import { getSubgraphExplorerUrl } from 'common-util/subgraph';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { ExternalLink } from 'components/ui/typography';
import { CodeSnippet } from './CodeSnippet';

export const DailyActiveAgentsInfo = () => {
  return (
    <>
      <SectionWrapper id="daily-active-agents">
        <h2 className={SUB_HEADER_LG_CLASS}>Daily Active Agents</h2>

        <div className="space-y-6 mt-4">
          <p>
            Tracks how many unique multisigs were active each day for all agents across all
            supported networks. This metric is useful to understand the operational footprint and
            engagement of specific agents over time. The <strong>active multisig count</strong>{' '}
            reflects the number of unique multisigs that performed at least one on-chain interaction
            attributed to a given agent within the UTC day window.
          </p>

          <p>The following query is used to compute daily active agents:</p>

          <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Daily Active Multisigs query</h3>

          <p className="text-purple-600">
            Subgraph links:{' '}
            {REGISTRY_SUBGRAPH_URLS.map(({ key, url }) => (
              <ExternalLink key={key} href={getSubgraphExplorerUrl(url)} className="mr-2">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </ExternalLink>
            ))}
          </p>
          <CodeSnippet>{dailyAgentPerformancesQuery}</CodeSnippet>
        </div>
      </SectionWrapper>
      <SectionWrapper id="babydegen-daily-active-agents">
        <h2 className={SUB_HEADER_LG_CLASS}>Babydegen Daily Active Agents</h2>

        <div className="space-y-6 mt-4">
          <p>
            Tracks how many unique multisigs were active each day for Babydegen agents. This metric
            is useful to understand the operational footprint and engagement of specific agents over
            time. The <strong>active multisig count</strong> reflects the number of unique multisigs
            that performed at least one on-chain interaction attributed to a given agent within the
            UTC day window.
          </p>

          <p>The following query is used to compute daily active agents:</p>

          <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Daily Performance query</h3>

          <p className="text-purple-600">
            Subgraph links:{' '}
            {REGISTRY_SUBGRAPH_URLS.filter(({ key }) => ['mode', 'optimism'].includes(key)).map(
              ({ key, url }) => (
                <ExternalLink key={key} href={getSubgraphExplorerUrl(url)} className="mr-2">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </ExternalLink>
              )
            )}
          </p>
          <CodeSnippet>{dailyBabydegenPerformancesQuery}</CodeSnippet>
        </div>
      </SectionWrapper>
      <SectionWrapper id="agentsfun-daily-active-agents">
        <h2 className={SUB_HEADER_LG_CLASS}>Agents.fun Daily Active Agents</h2>

        <div className="space-y-6 mt-4">
          <p>
            Tracks how many unique multisigs were active each day for Agents.fun agents. The{' '}
            <strong>active multisig count</strong> reflects the number of unique multisigs that
            performed at least one on-chain interaction attributed to a given agent within the UTC
            day window.
          </p>

          <p>The following query is used to compute daily active agents:</p>

          <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Daily Performance query</h3>

          <p className="text-purple-600">
            Subgraph links:{' '}
            {REGISTRY_SUBGRAPH_URLS.filter(({ key }) => key === 'base').map(({ key, url }) => (
              <ExternalLink key={key} href={getSubgraphExplorerUrl(url)} className="mr-2">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </ExternalLink>
            ))}
          </p>
          <CodeSnippet>{dailyAgentsFunPerformancesQuery}</CodeSnippet>
        </div>
      </SectionWrapper>
      <SectionWrapper id="mech-daily-active-agents">
        <h2 className={SUB_HEADER_LG_CLASS}>Mech Daily Active Agents</h2>

        <div className="space-y-6 mt-4">
          <p>
            Tracks how many unique multisigs of Mech agents were active each day. This metric is
            useful to understand the operational footprint and engagement of specific agents over
            time. The <strong>active multisig count</strong> reflects the number of unique multisigs
            that performed at least one on-chain interaction attributed to a given agent within the
            UTC day window.
          </p>

          <p>The following query is used to compute daily active agents:</p>

          <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Daily Performance query</h3>

          <p className="text-purple-600">
            Subgraph links:{' '}
            {REGISTRY_SUBGRAPH_URLS.filter(({ key }) =>
              ['gnosis', 'base', 'polygon', 'optimism'].includes(key)
            ).map(({ key, url }) => (
              <ExternalLink key={key} href={getSubgraphExplorerUrl(url)} className="mr-2">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </ExternalLink>
            ))}
          </p>
          <CodeSnippet>{dailyMechAgentPerformancesQuery}</CodeSnippet>
        </div>
      </SectionWrapper>
      <SectionWrapper id="omenstrat-daily-active-agents">
        <h2 className={SUB_HEADER_LG_CLASS}>Omenstrat Daily Active Agents</h2>

        <div className="space-y-6 mt-4">
          <p>
            Tracks unique multisigs active each day for Omenstrat agents on{' '}
            <strong>Gnosis chain</strong>. Omenstrat agents participate in Omen prediction markets.
            The <strong>active multisig count</strong> reflects multisigs that performed at least
            one on-chain interaction within the UTC day window.
          </p>

          <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Daily Performance query</h3>

          <p className="text-purple-600">
            Subgraph link:{' '}
            {REGISTRY_SUBGRAPH_URLS.filter(({ key }) => key === 'gnosis').map(({ key, url }) => (
              <ExternalLink key={key} href={getSubgraphExplorerUrl(url)} className="mr-2">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </ExternalLink>
            ))}
          </p>
          <p>
            Note: this query uses the following agentId_in parameter:{' '}
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
              [{OMENSTRAT_AGENT_CLASSIFICATION.valory_trader.join(', ')}]
            </code>
          </p>
          <CodeSnippet>{dailyPredictAgentsPerformancesQuery}</CodeSnippet>
        </div>
      </SectionWrapper>
      <SectionWrapper id="polystrat-daily-active-agents">
        <h2 className={SUB_HEADER_LG_CLASS}>Polystrat Daily Active Agents</h2>

        <div className="space-y-6 mt-4">
          <p>
            Tracks unique multisigs active each day for Polystrat agents on{' '}
            <strong>Polygon chain</strong>. Polystrat agents participate in Polymarket. The{' '}
            <strong>active multisig count</strong> reflects multisigs that performed at least one
            on-chain interaction within the UTC day window.
          </p>

          <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Daily Performance query</h3>

          <p className="text-purple-600">
            Subgraph link:{' '}
            {REGISTRY_SUBGRAPH_URLS.filter(({ key }) => key === 'polygon').map(({ key, url }) => (
              <ExternalLink key={key} href={getSubgraphExplorerUrl(url)} className="mr-2">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </ExternalLink>
            ))}
          </p>

          <p>
            Note: tThis query uses the following agentId_in parameter:{' '}
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
              [{POLYSTRAT_AGENT_CLASSIFICATION.valory_trader.join(', ')}]
            </code>
          </p>

          <CodeSnippet>{dailyPredictAgentsPerformancesQuery}</CodeSnippet>
        </div>
      </SectionWrapper>
      <SectionWrapper id="pearl-daily-active-agents">
        <h2 className={SUB_HEADER_LG_CLASS}>Pearl Daily Active Agents</h2>

        <div className="space-y-6 mt-4">
          <p>
            Tracks how many unique multisigs were active each day for all agents in the Pearl app.
            The <strong>active multisig count</strong> reflects the number of unique multisigs that
            performed at least one on-chain interaction attributed to these agents within the UTC
            day window.
          </p>

          <p>The following queries are used to compute Pearl daily active agents:</p>

          <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Pearl Prediction Agents Query</h3>

          <p className="text-purple-600">
            Subgraph links:{' '}
            {REGISTRY_SUBGRAPH_URLS.filter(({ key }) => key === 'gnosis').map(({ key, url }) => (
              <ExternalLink key={key} href={getSubgraphExplorerUrl(url)} className="mr-2">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </ExternalLink>
            ))}
          </p>
          <CodeSnippet>{dailyPredictAgentsPerformancesQuery}</CodeSnippet>

          <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Optimus Babydegen Query</h3>

          <p className="text-purple-600">
            Subgraph links:{' '}
            {REGISTRY_SUBGRAPH_URLS.filter(({ key }) => key === 'optimism').map(({ key, url }) => (
              <ExternalLink key={key} href={getSubgraphExplorerUrl(url)} className="mr-2">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </ExternalLink>
            ))}
          </p>
          <CodeSnippet>{dailyBabydegenPerformancesQuery}</CodeSnippet>
        </div>
      </SectionWrapper>
      <SectionWrapper id="contribute-daily-active-agents">
        <h2 className={SUB_HEADER_LG_CLASS}>Contribute Daily Active Agents</h2>

        <div className="space-y-6 mt-4">
          <p>
            Tracks how many unique agent-41 services received ETH each day on Base. The{' '}
            <strong>count</strong> reflects the number of unique services that were active within
            the UTC day window.
          </p>

          <p>The following query is used to compute daily active agents:</p>

          <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Daily Activities Query</h3>

          <p className="text-purple-600">
            Subgraph links:{' '}
            <ExternalLink
              href={getSubgraphExplorerUrl(AUTONOLAS_BASE_SUBGRAPH_URL)}
              className="mr-2"
            >
              Base
            </ExternalLink>
          </p>
          <CodeSnippet>{dailyActivitiesQuery}</CodeSnippet>
        </div>
      </SectionWrapper>
    </>
  );
};
