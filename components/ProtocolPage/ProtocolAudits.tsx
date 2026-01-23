import { TEXT_LARGE_CLASS } from 'common-util/classes';
import { VALORY_GIT_URL, X_OLAS_URL, X_VALORY_AG_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import SectionHeading from 'components/SectionHeading';
import { Card } from 'components/ui/card';
import Image from 'next/image';

const audits = [
  {
    category: 'Single auditors',
    list: [
      {
        title: 'SourceHat *',
        iconSrc: 'sourcehat.png',
        content: (
          <>
            <ul className="list-disc ml-6 mb-3 space-y-2">
              <li className="text-purple-600">
                <a href="https://sourcehat.com/audits/ValoryAgentRegistries/" target="_blank">
                  Registries, 15.07.22
                </a>
              </li>
              <li className="text-purple-600">
                <a href="https://sourcehat.com/audits/AutonolasTokenomics/" target="_blank">
                  Tokenomics, 16.02.23
                </a>
              </li>
              <li className="text-purple-600">
                <a href="https://sourcehat.com/audits/ValoryOLAS/" target="_blank">
                  Governance & OLAS, 23.06.22
                </a>
              </li>
            </ul>
            <p className="italic text-sm text-[#606F85]">* Formerly known as Solidity Finance</p>
          </>
        ),
      },
      {
        title: 'ApeWorx',
        iconSrc: 'apeworx.png',
        content: (
          <a
            href={`${VALORY_GIT_URL}/autonolas-governance/blob/main/audits/Valory%20Review%20Final.pdf`}
            className="text-purple-600"
            target="_blank"
          >
            Governance, 06.06.22
          </a>
        ),
      },
    ],
  },
  {
    category: 'Competitive audits',
    list: [
      {
        title: 'Immunefi',
        secondary: 'Up to $50K',
        iconSrc: 'immunefi.png',
        content: (
          <ul className="list-disc ml-6 space-y-2">
            <li className="text-purple-600">
              <a href={`${X_OLAS_URL}/status/1557431064632647680`} target="_blank">
                Governance & OLAS, 08.22
              </a>
            </li>
            <li className="text-purple-600">
              <a href={`${X_OLAS_URL}/status/1689316293030359040`} target="_blank">
                Tokenomics & Registries, 08.23
              </a>
            </li>
            <li className="text-purple-600">
              <a href="https://immunefi.com/bug-bounty/autonolas/information/" target="_blank">
                Staking, 08.24
              </a>
            </li>
          </ul>
        ),
      },
      {
        title: 'code4rena',
        secondary: '$90k',
        iconSrc: 'code4rena.png',
        content: (
          <ul className="list-disc ml-6 space-y-2 text-purple-600">
            <li>
              <a href="https://code4rena.com/audits/2023-12-olas" target="_blank">
                Governance, Tokenomics & Registries on mainnet & contracts on Solana, 12.23
              </a>
            </li>
            <li>
              <a href="https://code4rena.com/audits/2024-05-olas" target="_blank">
                Governance, Tokenomics & Registries, 05.24{' '}
              </a>{' '}
              ($90k)
            </li>
            <li>
              <a href="https://code4rena.com/audits/2026-01-olas" target="_blank">
                OLAS Smart Contracs Audit, 01.26{' '}
              </a>
              ($62k)
            </li>
          </ul>
        ),
      },
      {
        title: 'Cantina',
        secondary: '$50k',
        iconSrc: 'cantina.png',
        content: (
          <ul className="list-disc ml-6 space-y-2 text-purple-600">
            <li>
              <a href={`${X_VALORY_AG_URL}/status/1769951643330810357`} target="_blank">
                Various contracts on Solana, 03.24
              </a>
            </li>
            <li>
              <a
                href="https://cantina.xyz/portfolio/ff3a291b-4cdd-4ebb-9828-c0ebc7f21edf"
                target="_blank"
              >
                AI Registry Mech Security Audit, 01.25
              </a>
            </li>
          </ul>
        ),
      },
    ],
  },
];

export const ProtocolAudits = () => (
  <SectionWrapper customClasses="lg:p-24 px-4 py-12 border-y" id="protocol-audits">
    <div className={`max-w-[648px] mx-auto gap-5`}>
      <SectionHeading
        size="max-sm:text-5xl"
        color="text-gray-900"
        weight="font-bold"
        other="text-center mb-0"
      >
        Protocol Audits
      </SectionHeading>
      {audits.map((audit) => (
        <div key={audit.category}>
          <p className={`${TEXT_LARGE_CLASS} font-bold mb-6 mt-14`}>{audit.category}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {audit.list.map((auditor) => (
              <Card key={auditor.title}>
                <div className="flex gap-3 border-b-1.5 px-6 py-4 items-center">
                  <Image
                    src={`/images/protocol-page/${auditor.iconSrc}`}
                    width={40}
                    height={40}
                    alt="Protocol audits"
                  />
                  <p className="text-xl font-semibold">{auditor.title}</p>

                  {auditor.secondary && (
                    <p className="ml-auto text-[#606F85]">{auditor.secondary}</p>
                  )}
                </div>
                <div className="px-6 py-4">{auditor.content}</div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  </SectionWrapper>
);
