import {
  MARKETPLACE_CHAIN_SCOPE,
  MARKETPLACE_SETTLEMENT_WALK_CHAINS,
  MARKETPLACE_SQUID_URLS,
  MARKETPLACE_SUBGRAPH_URLS,
} from 'common-util/indexers';
import { SUB_HEADER_LG_CLASS, TEXT_MEDIUM_CLASS } from 'common-util/classes';
import {
  mechOffChainDeliveriesPageQuery,
  mechOffChainDeliveriesPageSquidQuery,
  mechOffChainSendersPageQuery,
  mechOffChainSendersPageSquidQuery,
} from 'common-util/graphql/queries';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { CodeSnippet } from './CodeSnippet';
import { IndexerLinks } from './IndexerLinks';

const settlementWalkChainNames = (() => {
  const names = MARKETPLACE_SETTLEMENT_WALK_CHAINS.map(
    (k) => k.charAt(0).toUpperCase() + k.slice(1)
  );
  return names.length > 1
    ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`
    : names.join('');
})();

export const MechOffChainShareInfo = () => {
  return (
    <SectionWrapper id="mech-offchain-share">
      <h2 className={SUB_HEADER_LG_CLASS}>Mech Off-chain Share</h2>

      <div className="space-y-6 mt-4">
        <p>
          Splits all-time Mech requests across {MARKETPLACE_CHAIN_SCOPE} into requests made on-chain
          and requests sent off-chain through the Mech API. An off-chain request has no on-chain
          request transaction. It appears on-chain only when the mech settles it in a signed
          delivery, so off-chain requests and off-chain deliveries are the same count, and requests
          that were never settled are not included.
        </p>

        <p>For each chain:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Off-chain requests are the sum of <code>numDeliveries</code> over all{' '}
            <code>MarketplaceDeliveryWithSignatures</code> rows on {settlementWalkChainNames}, and
            the sum of <code>Sender.totalOffChainRequests</code> on the other chains. Both count
            each settled off-chain request once.
          </li>
          <li>
            On-chain requests are <code>global.totalRequests</code> minus the sum of{' '}
            <code>Sender.totalOffChainRequests</code>, and on-chain deliveries are{' '}
            <code>global.totalDeliveries</code> minus the same sum. The settlement handler adds the
            same amount to the sender counter and to both globals, so this removes exactly the
            off-chain part of the globals.
          </li>
          <li>
            On subgraphs, every page walk is pinned to the block the globals were read at, so the
            split is exact. Squids cannot read at a past block, so on squid chains the globals are
            read again after the walks, and a settlement landing between reads can shift that
            chain&apos;s split by a few requests until the next refresh.
          </li>
        </ul>
        <p>
          The share is off-chain requests divided by on-chain plus off-chain requests, summed over
          all chains.
        </p>

        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Off-chain Settlements Query</h3>
        <p className="text-purple-600">
          Subgraph links: <IndexerLinks urls={MARKETPLACE_SUBGRAPH_URLS} />
        </p>
        <CodeSnippet>{mechOffChainDeliveriesPageQuery}</CodeSnippet>
        <p className="text-purple-600">
          Squid links (OpenReader dialect): <IndexerLinks urls={MARKETPLACE_SQUID_URLS} />
        </p>
        <CodeSnippet>{mechOffChainDeliveriesPageSquidQuery}</CodeSnippet>

        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Off-chain Requesters Query</h3>
        <CodeSnippet>{mechOffChainSendersPageQuery}</CodeSnippet>
        <CodeSnippet>{mechOffChainSendersPageSquidQuery}</CodeSnippet>
      </div>
    </SectionWrapper>
  );
};
