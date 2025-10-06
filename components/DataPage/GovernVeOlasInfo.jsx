import { SUB_HEADER_LG_CLASS, TEXT_MEDIUM_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { CodeSnippet } from './CodeSnippet';

export const GovernVeOlasInfo = () => (
  <SectionWrapper id="govern-veolas">
    <h2 className={SUB_HEADER_LG_CLASS}>veOLAS Holders (Active)</h2>

    <div className="space-y-6 mt-4">
      <p>
        Counts the number of wallets with an active veOLAS lock on Ethereum. The
        metric sums all veolasDepositors where <code>unlockTimestamp</code> is
        in the future, using the tokenomics subgraph.
      </p>

      <div>
        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Subgraph</h3>
        <p className="text-purple-600">
          {process.env.NEXT_PUBLIC_TOKENOMICS_ETHEREUM_SUBGRAPH_URL}
        </p>
      </div>

      <div>
        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>
          Active veOLAS depositors query
        </h3>
        <p className="text-sm text-slate-500">
          Pagination uses <code>first: 1000</code> pages, advancing with
          <code>skip</code> until fewer than 1000 records remain. The
          <code>$unlockAfter</code> variable is set to the current UTC timestamp
          (seconds).
        </p>
        <CodeSnippet>
          {`query ActiveVeOlasDepositors($first: Int!, $skip: Int!, $unlockAfter: BigInt!) {
  veolasDepositors(
    first: $first
    skip: $skip
    where: { unlockTimestamp_gt: $unlockAfter }
    orderBy: unlockTimestamp
    orderDirection: asc
  ) {
    id
    unlockTimestamp
  }
}`}
        </CodeSnippet>
      </div>
    </div>
  </SectionWrapper>
);
