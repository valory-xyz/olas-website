import { REGISTRY_SQUID_URLS, REGISTRY_SUBGRAPH_URLS } from 'common-util/indexers';
import { SUB_HEADER_LG_CLASS, TEXT_MEDIUM_CLASS } from 'common-util/classes';
import {
  OMENSTRAT_AGENT_CLASSIFICATION,
  POLYSTRAT_AGENT_CLASSIFICATION,
} from 'common-util/constants';
import {
  dailyAgentPerformancesQuery,
  dailyAgentPerformancesSquidQuery,
  dailyAgentsFunPerformancesSquidQuery,
  dailyBabydegenPerformancesQuery,
  dailyBasiusPerformancesSquidQuery,
  dailyContributePerformancesSquidQuery,
  dailyMechAgentPerformancesQuery,
  dailyMechAgentPerformancesSquidQuery,
  dailyPredictAgentsPerformancesQuery,
} from 'common-util/graphql/queries';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { IndexerLinks } from './IndexerLinks';
import { CodeSnippet } from './CodeSnippet';

// The fetcher inlines midnight UTC of each of the last 7 full days; shown here as named
// placeholders so the static page doesn't bake in build-time dates. The snippet uses stable
// `day1`…`day7` aliases so it stays valid GraphQL.
const dailyAgentPerformancesSquidDays = Array.from({ length: 7 }, (_, index) =>
  index === 0 ? '$midnightUtc1DayAgo' : `$midnightUtc${index + 1}DaysAgo`
);
const dailyAgentPerformancesSquidAliases = Array.from(
  { length: 7 },
  (_, index) => `day${index + 1}`
);

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
            Subgraph links: <IndexerLinks urls={REGISTRY_SUBGRAPH_URLS} />
          </p>
          <CodeSnippet>{dailyAgentPerformancesQuery}</CodeSnippet>
          <p className="text-purple-600">
            Squid link (OpenReader dialect):{' '}
            <IndexerLinks urls={REGISTRY_SQUID_URLS} chains={['base']} />
          </p>
          <CodeSnippet>
            {dailyAgentPerformancesSquidQuery(
              dailyAgentPerformancesSquidDays,
              dailyAgentPerformancesSquidAliases
            )}
          </CodeSnippet>
          <p>
            Replace each <code>$midnightUtc…</code> placeholder with that day&apos;s midnight UTC
            unix timestamp.
          </p>
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
            UTC day window. Modius and Optimus register under <code>agentId = 40</code>, while
            Basius (Base) registers under <code>agentId = 115</code>, so two queries are used.
          </p>

          <p>The following queries are used to compute daily active agents:</p>

          <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>
            Modius &amp; Optimus Daily Performance query
          </h3>

          <p className="text-purple-600">
            Subgraph links:{' '}
            <IndexerLinks urls={REGISTRY_SUBGRAPH_URLS} chains={['mode', 'optimism']} />
          </p>
          <CodeSnippet>{dailyBabydegenPerformancesQuery}</CodeSnippet>

          <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Basius Daily Performance query</h3>

          <p className="text-purple-600">
            Squid link (OpenReader dialect):{' '}
            <IndexerLinks urls={REGISTRY_SQUID_URLS} chains={['base']} />
          </p>
          <CodeSnippet>{dailyBasiusPerformancesSquidQuery}</CodeSnippet>
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
            Squid link (OpenReader dialect):{' '}
            <IndexerLinks urls={REGISTRY_SQUID_URLS} chains={['base']} />
          </p>
          <CodeSnippet>{dailyAgentsFunPerformancesSquidQuery}</CodeSnippet>
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
            <IndexerLinks
              urls={REGISTRY_SUBGRAPH_URLS}
              chains={['gnosis', 'polygon', 'optimism']}
            />
          </p>
          <CodeSnippet>{dailyMechAgentPerformancesQuery}</CodeSnippet>
          <p className="text-purple-600">
            Squid link (OpenReader dialect):{' '}
            <IndexerLinks urls={REGISTRY_SQUID_URLS} chains={['base']} />
          </p>
          <CodeSnippet>{dailyMechAgentPerformancesSquidQuery}</CodeSnippet>
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
            Subgraph link: <IndexerLinks urls={REGISTRY_SUBGRAPH_URLS} chains={['gnosis']} />
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
            Subgraph link: <IndexerLinks urls={REGISTRY_SUBGRAPH_URLS} chains={['polygon']} />
          </p>

          <p>
            Note: This query uses the following agentId_in parameter:{' '}
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
            Subgraph links: <IndexerLinks urls={REGISTRY_SUBGRAPH_URLS} chains={['gnosis']} />
          </p>
          <CodeSnippet>{dailyPredictAgentsPerformancesQuery}</CodeSnippet>

          <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Optimus Babydegen Query</h3>

          <p className="text-purple-600">
            Subgraph links: <IndexerLinks urls={REGISTRY_SUBGRAPH_URLS} chains={['optimism']} />
          </p>
          <CodeSnippet>{dailyBabydegenPerformancesQuery}</CodeSnippet>
        </div>
      </SectionWrapper>
      <SectionWrapper id="contribute-daily-active-agents">
        <h2 className={SUB_HEADER_LG_CLASS}>Contribute Daily Active Agents</h2>

        <div className="space-y-6 mt-4">
          <p>
            Tracks unique multisigs active each day for Contribute agents on <strong>Base</strong>,
            scoped by <code>agentId = 41</code>. The <strong>active multisig count</strong> reflects
            multisigs that performed at least one on-chain interaction attributed to the Contribute
            agent within the UTC day window.
          </p>

          <p>The following query is used to compute daily active agents:</p>

          <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Daily Performance query</h3>

          <p className="text-purple-600">
            Squid link (OpenReader dialect):{' '}
            <IndexerLinks urls={REGISTRY_SQUID_URLS} chains={['base']} />
          </p>
          <CodeSnippet>{dailyContributePerformancesSquidQuery}</CodeSnippet>
        </div>
      </SectionWrapper>
    </>
  );
};
