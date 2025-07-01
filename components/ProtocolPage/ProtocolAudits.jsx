import {
  SCREEN_WIDTH_LG,
  SUB_HEADER_CLASS,
  TEXT_LARGE_CLASS,
} from 'common-util/classes';
import { VALORY_GIT_URL, X_OLAS_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Image from 'next/image';

const audits = [
  {
    category: 'Single auditors',
    list: [
      {
        title: 'SourceHat',
        iconSrc: 'SourceHat.png',
        content: (
          <>
            <p className="italic">(formerly known as Solidity Finance)</p>
            <ul className="list-disc ml-6 space-y-2">
              <li className="text-purple-600">
                <a
                  href="https://sourcehat.com/audits/ValoryAgentRegistries/"
                  className="text-purple-600"
                  target="_blank"
                >
                  Registries, 15.07.22
                </a>
              </li>
              <li className="text-purple-600">
                <a
                  href="https://sourcehat.com/audits/AutonolasTokenomics/"
                  className="text-purple-600"
                  target="_blank"
                >
                  Tokenomics, 16.02.23
                </a>
              </li>
              <li className="text-purple-600">
                <a
                  href="https://sourcehat.com/audits/ValoryOLAS/"
                  className="text-purple-600"
                  target="_blank"
                >
                  Governance & OLAS, 23.06.22
                </a>
              </li>
            </ul>
          </>
        ),
      },
      {
        title: 'ApeWorx',
        iconSrc: 'ApeWorx.jpg',
        content: (
          <ul className="list-disc ml-6 space-y-2">
            <li className="text-purple-600">
              <a
                href={`${VALORY_GIT_URL}/autonolas-governance/blob/main/audits/Valory%20Review%20Final.pdf`}
                className="text-purple-600"
                target="_blank"
              >
                Governance, 06.06.22
              </a>
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
          <ul className="list-disc ml-6 space-y-2">
            <li>
              <p>Up to $50k: </p>
              <a
                href={`${X_OLAS_URL}/status/1557431064632647680`}
                className="text-purple-600"
                target="_blank"
              >
                Governance & OLAS, 08.22
              </a>
              ;{' '}
              <a
                href={`${X_OLAS_URL}/status/1689316293030359040`}
                className="text-purple-600"
                target="_blank"
              >
                Tokenomics & Registries, 08.23
              </a>
              ;{' '}
              <a
                href="https://immunefi.com/bug-bounty/autonolas/information/"
                className="text-purple-600"
                target="_blank"
              >
                Staking, 08.24
              </a>
            </li>
          </ul>
        ),
      },
      {
        title: 'Cantina',
        iconSrc: 'Cantina.png',
        content: (
          <ul className="list-disc ml-6 space-y-2">
            <li>
              <a
                href={`${X_VALORY_AG_URL}/status/1769951643330810357`}
                className="text-purple-600"
                target="_blank"
              >
                Various contracts on Solana, 03.24
              </a>{' '}
              ($50k)
            </li>
            <li>
              <a
                href="https://cantina.xyz/portfolio/ff3a291b-4cdd-4ebb-9828-c0ebc7f21edf"
                className="text-purple-600"
                target="_blank"
              >
                AI Registry Mech Security Audit, 01.25
              </a>
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
              <a
                href="https://code4rena.com/audits/2023-12-olas"
                className="text-purple-600"
                target="_blank"
              >
                Governance, Tokenomics & Registries on mainnet & contracts on
                Solana, 12.23{' '}
              </a>{' '}
              ($90k)
            </li>
            <li>
              <a
                href="https://code4rena.com/audits/2024-05-olas"
                className="text-purple-600"
                target="_blank"
              >
                Governance, Tokenomics & Registries, 05.24{' '}
              </a>{' '}
              ($90k)
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
          <p className={`${TEXT_LARGE_CLASS} font-bold my-4`}>
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
