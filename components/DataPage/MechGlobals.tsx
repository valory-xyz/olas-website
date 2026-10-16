import {
  MARKETPLACE_CHAIN_SCOPE,
  MARKETPLACE_SQUID_URLS,
  MARKETPLACE_SUBGRAPH_URLS,
} from 'common-util/indexers';
import { SUB_HEADER_LG_CLASS, TEXT_MEDIUM_CLASS } from 'common-util/classes';
import {
  mechMarketplaceTotalRequestsQuery,
  mechMarketplaceTotalRequestsSquidQuery,
} from 'common-util/graphql/queries';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { CodeSnippet } from './CodeSnippet';
import { IndexerLinks } from './IndexerLinks';

export const MechGlobalsInfo = () => {
  return (
    <SectionWrapper id="mech-globals">
      <h2 className={SUB_HEADER_LG_CLASS}>Mech Globals</h2>

      <div className="space-y-6 mt-4">
        <p>
          Total requests and deliveries are aggregated from Mech Marketplace subgraphs and squids
          across {MARKETPLACE_CHAIN_SCOPE}. Each chain&apos;s total is rebuilt as on-chain plus
          settled off-chain requests (see{' '}
          <a className="text-purple-600" href="#mech-offchain-share">
            Mech Off-chain Share
          </a>
          ), so every signed delivery counts once.
        </p>

        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Mech Marketplace Globals Query</h3>
        <p className="text-purple-600">
          Subgraph links: <IndexerLinks urls={MARKETPLACE_SUBGRAPH_URLS} />
        </p>
        <CodeSnippet>{mechMarketplaceTotalRequestsQuery}</CodeSnippet>
        <p className="text-purple-600">
          Squid links (OpenReader dialect): <IndexerLinks urls={MARKETPLACE_SQUID_URLS} />
        </p>
        <CodeSnippet>{mechMarketplaceTotalRequestsSquidQuery}</CodeSnippet>
      </div>
    </SectionWrapper>
  );
};
