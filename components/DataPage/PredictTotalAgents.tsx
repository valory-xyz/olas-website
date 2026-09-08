import { SUB_HEADER_LG_CLASS, TEXT_MEDIUM_CLASS } from 'common-util/classes';
import {
  OMENSTRAT_AGENT_CLASSIFICATION,
  POLYSTRAT_AGENT_CLASSIFICATION,
  REGISTRY_SUBGRAPH_URLS,
} from 'common-util/constants';
import { agentServicesQuery } from 'common-util/graphql/queries';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { CodeSnippet } from './CodeSnippet';
import { SubgraphLink } from './SubgraphLink';

const PLATFORMS = [
  {
    id: 'omenstrat-total-agents',
    name: 'Omenstrat',
    chainKey: 'gnosis',
    chainName: 'Gnosis chain',
    market: 'Omen prediction markets',
    agentIds: OMENSTRAT_AGENT_CLASSIFICATION.valory_trader,
  },
  {
    id: 'polystrat-total-agents',
    name: 'Polystrat',
    chainKey: 'polygon',
    chainName: 'Polygon chain',
    market: 'Polymarket',
    agentIds: POLYSTRAT_AGENT_CLASSIFICATION.valory_trader,
  },
];

export const PredictTotalAgentsInfo = () => (
  <>
    {PLATFORMS.map(({ id, name, chainKey, chainName, market, agentIds }) => (
      <SectionWrapper key={id} id={id}>
        <h2 className={SUB_HEADER_LG_CLASS}>{name} Total Agents</h2>

        <div className="space-y-6 mt-4">
          <p>
            Counts every {name} agent ever registered on <strong>{chainName}</strong>. {name} agents
            participate in {market}. Each agent is a <strong>service</strong> minted in the Olas
            registry with a {name} trader agent id, so the total is the number of distinct services
            whose <code>agentIds</code> include one of those ids, regardless of whether the agent is
            still running.
          </p>

          <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Services query</h3>

          <p className="text-purple-600">
            Subgraph link:{' '}
            {REGISTRY_SUBGRAPH_URLS.filter(({ key }) => key === chainKey).map(({ key, url }) => (
              <SubgraphLink key={key} apiUrl={url} className="mr-2">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </SubgraphLink>
            ))}
          </p>
          <p>
            Note: <code>agentIds_contains</code> matches services listing every id passed, so the
            query runs once per agent id in{' '}
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">[{agentIds.join(', ')}]</code>{' '}
            and the resulting service ids are combined and de-duplicated. Pages of 1,000 are walked
            with the <code>id_gt</code> cursor until a short page is returned.
          </p>
          <CodeSnippet>{agentServicesQuery}</CodeSnippet>
        </div>
      </SectionWrapper>
    ))}
  </>
);
