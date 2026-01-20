import { SUB_HEADER_LG_CLASS, TEXT_MEDIUM_CLASS } from 'common-util/classes';
import { AUTONOLAS_BASE_SUBGRAPH_URL, REGISTRY_SUBGRAPH_URLS } from 'common-util/constants';
import {
  dailyActivitiesQuery,
  dailyAgentPerformancesQuery,
  dailyAgentsFunPerformancesQuery,
  dailyBabydegenPerformancesQuery,
  dailyMechAgentPerformancesQuery,
  dailyPredictAgentsPerformancesQuery,
} from 'common-util/graphql/queries';
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
            {[
              REGISTRY_SUBGRAPH_URLS.gnosis,
              REGISTRY_SUBGRAPH_URLS.base,
              process.env.NEXT_PUBLIC_MODE_REGISTRY_SUBGRAPH_URL,
              REGISTRY_SUBGRAPH_URLS.optimism,
            ].map((link, index) => (
              <ExternalLink key={index} href={link} className="mr-2">
                {index + 1}
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
            Tracks how many unique multisigs were active each day for selected agents on Mode and
            Optimism. This metric is useful to understand the operational footprint and engagement
            of specific agents over time. The <strong>active multisig count</strong> reflects the
            number of unique multisigs that performed at least one on-chain interaction attributed
            to a given agent within the UTC day window.
          </p>

          <p>The following query is used to compute daily active agents:</p>

          <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Daily Performance query</h3>

          <p className="text-purple-600">
            Subgraph links:{' '}
            {[
              process.env.NEXT_PUBLIC_MODE_REGISTRY_SUBGRAPH_URL,
              REGISTRY_SUBGRAPH_URLS.optimism,
            ].map((link, index) => (
              <ExternalLink key={index} href={link} className="mr-2">
                {index + 1}
              </ExternalLink>
            ))}
          </p>
          <CodeSnippet>{dailyBabydegenPerformancesQuery}</CodeSnippet>
        </div>
      </SectionWrapper>
      <SectionWrapper id="agentsfun-daily-active-agents">
        <h2 className={SUB_HEADER_LG_CLASS}>Agents.fun Daily Active Agents</h2>

        <div className="space-y-6 mt-4">
          <p>
            Tracks how many unique multisigs were active each day for Agents.fun agents on Base. The{' '}
            <strong>active multisig count</strong> reflects the number of unique multisigs that
            performed at least one on-chain interaction attributed to a given agent within the UTC
            day window.
          </p>

          <p>The following query is used to compute daily active agents:</p>

          <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Daily Performance query</h3>

          <p className="text-purple-600">
            Subgraph links:{' '}
            {[REGISTRY_SUBGRAPH_URLS.base].map((link, index) => (
              <ExternalLink key={index} href={link} className="mr-2">
                {index + 1}
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
            Tracks how many unique multisigs were active each day for selected agents on Gnosis and
            Base. This metric is useful to understand the operational footprint and engagement of
            specific agents over time. The <strong>active multisig count</strong> reflects the
            number of unique multisigs that performed at least one on-chain interaction attributed
            to a given agent within the UTC day window.
          </p>

          <p>The following query is used to compute daily active agents:</p>

          <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Daily Performance query</h3>

          <p className="text-purple-600">
            Subgraph links:{' '}
            {[REGISTRY_SUBGRAPH_URLS.gnosis, REGISTRY_SUBGRAPH_URLS.base].map((link, index) => (
              <ExternalLink key={index} href={link} className="mr-2">
                {index + 1}
              </ExternalLink>
            ))}
          </p>
          <CodeSnippet>{dailyMechAgentPerformancesQuery}</CodeSnippet>
        </div>
      </SectionWrapper>
      <SectionWrapper id="predict-daily-active-agents">
        <h2 className={SUB_HEADER_LG_CLASS}>Predict Daily Active Agents</h2>

        <div className="space-y-6 mt-4">
          <p>
            Tracks how many unique multisigs were active each day for selected Predict agents on
            Gnosis. The <strong>active multisig count</strong>
            reflects the number of unique multisigs that performed at least one on-chain interaction
            attributed to a given agent within the UTC day window.
          </p>

          <p>The following query is used to compute daily active agents:</p>

          <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Daily Performance query</h3>

          <p className="text-purple-600">
            Subgraph links:{' '}
            {[REGISTRY_SUBGRAPH_URLS.gnosis].map((link, index) => (
              <ExternalLink key={index} href={link} className="mr-2">
                {index + 1}
              </ExternalLink>
            ))}
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
            {[REGISTRY_SUBGRAPH_URLS.gnosis].map((link, index) => (
              <ExternalLink key={index} href={link} className="mr-2">
                {index + 1}
              </ExternalLink>
            ))}
          </p>
          <CodeSnippet>{dailyPredictAgentsPerformancesQuery}</CodeSnippet>

          <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Optimus Babydegen Query</h3>

          <p className="text-purple-600">
            Subgraph links:{' '}
            {[REGISTRY_SUBGRAPH_URLS.optimism].map((link, index) => (
              <ExternalLink key={index} href={link} className="mr-2">
                {index + 1}
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
            <ExternalLink href={AUTONOLAS_BASE_SUBGRAPH_URL} className="mr-2">
              1
            </ExternalLink>
          </p>
          <CodeSnippet>{dailyActivitiesQuery}</CodeSnippet>
        </div>
      </SectionWrapper>
    </>
  );
};
