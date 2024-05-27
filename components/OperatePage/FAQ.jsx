import { Accordion } from 'common-util/Accordion';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Link from 'next/link';
import { SECTION_BOX_CLASS, SUB_HEADER_CLASS } from './utils';

const faqList = [
  {
    name: 'Olas Pearl',
    list: [
      {
        title: 'What is Pearl?',
        desc: 'Pearl allows you to set up and run agents directly from your computer and earn OLAS.',
      },
      {
        title: 'How do I install Pearl?',
        desc: (
          <>
            Visit the
            {' '}
            <Link href="/operate#download" className="text-purple-600">
              Pearl download section
            </Link>
            {', '}
            download the app, and follow the installation guide provided.
          </>
        ),
      },
      {
        title: 'What are the system requirements for Pearl?',
        desc: (
          <>
            Minimal system requirements for Mac devices:
            <ul className="list-disc ml-6">
              <li>
                Installed&nbsp;
                <Link
                  href="https://docs.docker.com/docker-for-mac/install/"
                  className="text-purple-600"
                  target="_blank"
                >
                  Docker desktop app ↗
                </Link>
              </li>
              <li>800 MB of free RAM (suggested 1 GB)</li>
              <li>1.3 GB disk space</li>
            </ul>
          </>
        ),
      },
      {
        title: 'What happens if I forget my password?',
        desc: (
          <>
            Pearl uses Safe smart wallets. Safe smart wallets are designed so
            that, if you forget your password, you can restore access to your
            funds using a backup wallet. This backup wallet acts as a second
            signer on your Safe. To learn more about this third party product
            and try to regain access, go to&nbsp;
            <Link
              href="https://safe.global/"
              className="text-purple-600"
              target="_blank"
            >
              safe.global
            </Link>
            , connect your backup wallet, and then access the Safe.
          </>
        ),
      },
    ],
  },
  {
    name: 'General',
    list: [
      {
        title: 'Can I run an agent without using the app?',
        desc: (
          <>
            Yes, for more technical control and flexibility, you can set up and
            run agents manually. Visit
            {' '}
            <Link
              href="https://operate.olas.network/"
              className="text-purple-600"
            >
              operate.olas.network
            </Link>
            {' '}
            to get started.
          </>
        ),
      },
      {
        title: 'How do I earn OLAS tokens?',
        desc: 'Earn OLAS by staking OLAS and running agents on your computer.',
      },
      {
        title: 'Where can I get support if I encounter issues?',
        desc: (
          <>
            There is no official support, but the
            {' '}
            <Link
              target="_blank"
              href="https://discord.com/channels/899649805582737479/1169275451089367131"
              className="text-purple-600"
            >
              Olas community
            </Link>
            {' '}
            can help you if you run into any issues.
          </>
        ),
      },
      {
        title: 'How can I optimize the performance of my agents?',
        desc: (
          <>
            You can optimize agent performance through modifying the agent code.
            Visit
            {' '}
            <Link
              href="https://operate.olas.network/"
              className="text-purple-600"
            >
              operate.olas.network
            </Link>
            {' '}
            to get started.
          </>
        ),
      },
    ],
  },
];

export const FAQ = () => (
  <SectionWrapper customClasses={`border bg-no-repeat ${SECTION_BOX_CLASS}`}>
    <div className="max-w-screen-lg px-0 mx-auto lg:grid-cols-12 lg:px-12">
      <div className="grid gap-12">
        <h2 className={`${SUB_HEADER_CLASS} text-left mb-6 lg:mb-8`}>
          Frequently asked questions
        </h2>
      </div>

      {faqList.map((faq, faqIndex) => (
        <div
          key={faq.name}
          className={faqIndex === faqList.length - 1 ? '' : 'mb-8'}
        >
          <div className="text-2xl font-semibold mt-2 mb-4">{faq.name}</div>

          {faq.list.map((eachFaq, index) => (
            <div className="py-2" key={index}>
              <Accordion label={eachFaq.title} defaultOpen={false}>
                {eachFaq.desc}
              </Accordion>
            </div>
          ))}
        </div>
      ))}
    </div>
  </SectionWrapper>
);
