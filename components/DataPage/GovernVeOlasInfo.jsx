import { SUB_HEADER_LG_CLASS, TEXT_MEDIUM_CLASS } from 'common-util/classes';
import { TOKENOMICS_SUBGRAPH_URLS } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { CodeSnippet } from './CodeSnippet';

export const GovernVeOlasInfo = () => (
  <SectionWrapper id="govern-veolas">
    <h2 className={SUB_HEADER_LG_CLASS}>veOLAS Holders (Active)</h2>

    <div className="space-y-6 mt-4">
      <p>
        Counts the number of wallets with an active veOLAS lock on Ethereum. The
        metric sums all veOLAS depositors where <code>unlockTimestamp</code> is
        in the future, using the tokenomics subgraph.
      </p>

      <div>
        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>Subgraph</h3>
        <ul className="list-disc list-inside text-sm text-slate-500">
          <li>
            {TOKENOMICS_SUBGRAPH_URLS[0] ? (
              <a
                href={TOKENOMICS_SUBGRAPH_URLS[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600"
              >
                Ethereum tokenomics subgraph
              </a>
            ) : (
              'Ethereum tokenomics subgraph'
            )}
          </li>
        </ul>
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

        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>
          veOLAS token balance
        </h3>
        <p className="text-sm text-slate-500">
          The locked OLAS amount is read directly from the veOLAS token entry in
          the same subgraph.
        </p>
        <CodeSnippet>
          {`query VeOlasLockedBalance {
  token(id: "0x7e01a500805f8a52fad229b3015ad130a332b7b3") {
    balance
  }
}`}
        </CodeSnippet>
      </div>
    </div>
  </SectionWrapper>
);
