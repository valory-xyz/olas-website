import {
  SCREEN_WIDTH_LG,
  SUB_HEADER_CLASS,
  TEXT_LARGE_CLASS,
} from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Image from 'next/image';
import Link from 'next/link';

const audits = [
  {
    category: 'Single auditors',
    list: [
      {
        title: 'SourceHat',
        iconSrc: 'SourceHat.png',
        content: (
          <ul className="list-disc ml-6 space-y-2">
            <li className="text-purple-600">
              <Link
                href="https://sourcehat.com/audits/ValoryOLAS/"
                className="text-purple-600"
              >
                OLAS, 23.06.22
              </Link>
            </li>
            <li className="text-purple-600">
              <Link
                href="https://sourcehat.com/audits/AutonolasTokenomics/"
                className="text-purple-600"
              >
                Tokenomics, 16.02.23
              </Link>
            </li>
          </ul>
        ),
      },
    ],
  },
  {
    category: 'Competitive audits',
    list: [
      {
        title: 'Immunefi',
        iconSrc: 'Immunefi.png',
        content: (
          <>
            <p>Up to $50k:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                <Link
                  href="https://x.com/autonolas/status/1557431064632647680"
                  className="text-purple-600"
                >
                  Governance & OLAS, 08.22
                </Link>
              </li>
              <li>
                <Link
                  href="https://x.com/autonolas/status/1689316293030359040"
                  className="text-purple-600"
                >
                  Tokenomics & Registries, 08.23
                </Link>
              </li>
              <li className="text-purple-600">
                <Link
                  href="https://immunefi.com/bug-bounty/autonolas/information/"
                  className="text-purple-600"
                >
                  Staking, 08.24
                </Link>
              </li>
            </ul>
          </>
        ),
      },
      {
        title: 'Cantina',
        iconSrc: 'Cantina.png',
        content: (
          <ul className="list-disc ml-6 space-y-2">
            <li>
              <Link
                href="https://x.com/valoryag/status/1769951643330810357"
                className="text-purple-600"
              >
                Various contracts on Solana, 03.24
              </Link>{' '}
              ($50k).
            </li>
          </ul>
        ),
      },
      {
        title: 'code4rena',
        iconSrc: 'code4rena.png',
        content: (
          <ul className="list-disc ml-6 space-y-2">
            <li>
              <Link
                href="https://code4rena.com/audits/2023-12-olas"
                className="text-purple-600"
              >
                Governance, Tokenomics & Registries on mainnet & contracts on
                Solana, 12.23{' '}
              </Link>{' '}
              ($90k).
            </li>
          </ul>
        ),
      },
    ],
  },
];

export const ProtocolAudits = () => (
  <SectionWrapper
    customClasses="lg:p-24 px-4 py-12 border-y"
    id="protocol-audits"
  >
    <div className={`${SCREEN_WIDTH_LG} gap-5`}>
      <h2 className={`${SUB_HEADER_CLASS} mb-2`}>Protocol audits</h2>

      {audits.map((audit) => (
        <div key={audit.category}>
          <p className={`${TEXT_LARGE_CLASS} font-bold mt-4`}>
            {audit.category}
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {audit.list.map((auditor) => (
              <div key={auditor.title} className="flex flex-col gap-6">
                <Image
                  src={`/images/protocol-page/${auditor.iconSrc}`}
                  width={150}
                  height={30}
                  alt="Protocol audits"
                />
                {auditor.content}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </SectionWrapper>
);
