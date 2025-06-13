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
        desc: (
          <div>
            Simply download Pearl{' '}
            <Link href="#download" className="text-purple-600">
              here
            </Link>{' '}
            and follow the step-by-step installation guide to get started.
          </div>
        ),
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
        title: 'What is an AI agent?',
        desc: 'AI agents are autonomous, open-source software entities designed to act on behalf of users or organizations, operating both off-chain and on-chain to deliver valuable services and interact within decentralized economies.',
      },
      {
        title:
          'Can I truly own and control my AI agent when using Pearl locally?',
        desc: 'Yes, you can truly own your AI agent when using Pearl.',
      },
      {
        title: 'What does it mean to co-own AI with Olas?',
        desc: (
          <div>
            When you use Pearl locally, you don&apos;t just interact with an AI
            agent — <strong>you own it</strong>. The agent runs directly on your
            device. Running an agent on Pearl means it&apos;s yours: you operate
            it and benefit from it.
          </div>
        ),
      },
      {
        title: 'Which AI agents can I find on Pearl (AI Agent App Store)?',
        desc: (
          <div>
            <p className="mb-3">
              Pearl features a growing collection of AI agents designed to
              perform various tasks. Available AI agents include: Modius Agent:
              Your DeFAI portfolio manager.
            </p>
            <ul className="list-disc ml-6">
              <li>
                Prediction Agent: An autonomous AI agent that participates in
                Prediction Markets.
              </li>
              <li>
                Agents.fun Agent: An AI influencer Agent that creates and shares
                content on X.
              </li>
              <li>
                Optimus Agent: An autonomous AI agent designed to streamline
                your DeFi experience.
              </li>
            </ul>
          </div>
        ),
      },
      {
        title: 'Can I run an AI agent without using the Pearl app?',
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
        title: "How can I optimize my AI agent's performance?",
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
              <Accordion
                label={eachFaq.title}
                customClass="p-0 bg-white"
                defaultOpen={false}
              >
                {eachFaq.desc}
              </Accordion>
            </div>
          ))}
        </div>
      ))}

      <div className="mt-8">
        To find out more,{' '}
        <Link href="/faq" className="text-purple-600">
          check out our FAQ
        </Link>
        .
      </div>
    </div>
  </SectionWrapper>
);
