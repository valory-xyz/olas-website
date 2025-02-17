import { Accordion } from 'common-util/Accordion';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { ExternalLink } from 'components/ui/typography';
import Link from 'next/link';
import { CTA, SECTION_BOX_CLASS, SUB_HEADER_CLASS } from './utils';

const faqList = [
  {
    name: 'Olas Pearl',
    list: [
      {
        title: 'What is Pearl?',
        desc: 'Pearl is a desktop app that lets you set up and run autonomous AI agents directly from your computer, enabling you to get the benefits of your agents and earn potential OLAS rewards through staking.',
      },
      {
        title: 'How do I install Pearl?',
        desc: 'Simply download Pearl here and follow the step-by-step installation guide to get started.',
      },
      {
        title: 'What are the system requirements for Pearl?',
        desc: (
          <ul className="list-disc ml-6">
            <li>Minimum 800 MB of free RAM (1 GB recommended)</li>
            <li>1.3 GB disk space.</li>
          </ul>
        ),
      },
      {
        title: 'What happens if I forget my password?',
        desc: (
          <>
            Pearl uses Safe smart wallets. If you forget your password, you can
            restore access using your backup wallet. Visit{' '}
            <ExternalLink href="https://safe.global/">Safe</ExternalLink> to
            connect your backup wallet and recover your funds.
          </>
        ),
      },
    ],
  },
  {
    name: 'General',
    list: [
      {
        title: 'Can I run an agent without using the Pearl app?',
        desc: (
          <>
            Yes, using the CLI. For more technical control, you can set up and
            run agents manually using Quickstart. Click{' '}
            <ExternalLink href={CTA}>here</ExternalLink> to get started.
          </>
        ),
      },
      {
        title: 'How do I earn OLAS tokens?',
        desc: 'Earn OLAS by running agents and staking tokens through Pearl or Quickstart.',
      },
      {
        title: 'When do agents get evicted?',
        desc: 'Agents are evicted if they fail to meet activity targets for two consecutive epochs.',
      },
      {
        title: 'How soon can I stake again after eviction?',
        desc: "You can stake again after a maximum wait of 24 hours, or immediately if you've staked for three consecutive epochs and slots are available.",
      },
      {
        title: 'Where can I get support if I encounter issues?',
        desc: (
          <>
            Join the community{' '}
            <Link
              target="_blank"
              href="https://discord.com/channels/899649805582737479/1244588374736502847"
              className="text-purple-600"
            >
              Discord
            </Link>{' '}
            for help.
          </>
        ),
      },
      {
        title: "How can I optimize my agent's performance?",
        desc: (
          <>
            Modify your agent&apos;s code for better results.{' '}
            <ExternalLink href={CTA}>Click here</ExternalLink> for Quickstart
            guides and technical resources. You can optimize agent performance
            through modifying the agent code.
          </>
        ),
      },
    ],
  },
];

export const FAQ = () => (
  <SectionWrapper
    customClasses={`border bg-no-repeat ${SECTION_BOX_CLASS}`}
    id="faq"
  >
    <div className="max-w-3xl px-0 mx-auto lg:grid-cols-12 lg:px-12">
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
