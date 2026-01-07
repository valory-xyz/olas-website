import { HowItWorks } from 'components/HowItWorks';

const list = [
  {
    title: 'Unlock A2A collaboration',
    description:
      'Enable your agents to outsource, transact, and work together, unlocking new possibilities without intervention.',
    imgSrc: 'a2a-collab',
  },
  {
    title: 'Monetize Your AI Agent',
    description:
      "Offer your AI Agent's off-chain services on the Mech Marketplace and start earning crypto rewards.",
    imgSrc: 'monetize-your-ai-agent',
  },
  {
    title: 'No More Code Upgrades',
    description:
      "If your Agent needs an off-chain skill it doesn't have, it can simply hire a Mech Agent from the AI Agent Bazaar to get the job done.",
    imgSrc: 'no-more-code-upgrades',
  },
  {
    title: 'Flexible and Scalable by Design',
    description:
      'From quick jobs to complex, long-running workflows — agents can handle it all. Real-time updates and dynamic coordination make scaling effortless.',
    imgSrc: 'flexible-and-scalable',
  },
  {
    title: 'Autonomous by Default',
    description:
      'Agents act independently — making decisions, delegating tasks, and working with others. Every action is visible, verifiable, and built on open standards for trust and extensibility.',
    imgSrc: 'autonomous-by-default',
  },
];

export const WhyUseMechMarketplace = () => (
  <div id="why-mech-marketplace">
    // @ts-expect-error TS(2304) FIXME: Cannot find name 'heade'.
    // @ts-expect-error TS(2741): Property 'description' is missing in type '{ heade... Remove this comment to see the full error message
    // @ts-expect-error TS(2741) FIXME: Property 'description' is missing in type '{ heade... Remove this comment to see the full error message
    <HowItWorks
      headerText="Why Businesses Use the Mech Marketplace: The AI Agent Bazaar"
      headerClassName="text-center"
      imgFolder="mech-marketplace"
      list={list}
    />
  </div>
);
