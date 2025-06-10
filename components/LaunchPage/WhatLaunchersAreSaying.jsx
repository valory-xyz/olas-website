import { TestimonySection } from 'components/TestimonySection';
import { ExternalLink } from 'components/ui/typography';

const quotes = [
  {
    projectImage: 'mode.png',
    projectUrl: 'https://www.mode.network/',
    quote: (
      <span>
        AI Agents are a core part of our DeFi mass adoption strategy here at
        Mode. We are thrilled to be building on the number one AI Agent network,
        launching Olas Modius with{' '}
        <ExternalLink href="https://x.com/valoryag" hideArrow>
          @ValoryAG
        </ExternalLink>
        , core contributors to{' '}
        <ExternalLink href="https://x.com/autonolas" hideArrow>
          @Autonolas
        </ExternalLink>
        . Olas Modius is an autonomous multi-agent system on Mode focused on
        intelligently managing your assets. You will soon be able to taste the
        future of AI agent-powered trading on Mode, leveraging the top DeFi
        protocols across our ecosystem.
      </span>
    ),
    name: 'James Ross',
    nameUrl: 'https://x.com/JRossTreacher',
    title: 'CEO, Mode',
    avatar: 'mode-avatar.png',
  },
  {
    projectImage: 'gnosis.png',
    projectUrl: 'https://www.gnosis.io/',
    quote:
      'Olas-powered AI Agents trading on prediction markets have become a large user of Gnosis Chain, bringing Gnosis back into the prediction market game with Olas and Safe. On many days these agents make over 75% of Safe transactions on Gnosis Chain.',
    name: 'Martin Köppelmann',
    nameUrl: 'https://x.com/koeppelmann',
    title: 'Co-founder, Gnosis',
    avatar: 'gnosis-avatar.png',
    blogUrl:
      '/blog/how-gnosis-used-olas-predict-to-build-the-largest-on-chain-prediction-market-economy',
  },
  {
    projectImage: 'olas.png',
    projectUrl: 'https://olas.network/agent-economies/mech',
    quote:
      'Olas Mechs were crafted as a way for AI agents to seamlessly request services from other agents via a single generic interface. This allows agents to offer any type of service and get paid. One example benefit is that it allows agents to access LLMs or various APIs without the pain of managing dozens of API keys. We’ve now turned this product into a full marketplace for AI agents: the AI Agent Bazaar.',
    name: 'David Minarsch',
    nameUrl: 'https://x.com/david_enim',
    title: 'CEO, Valory',
    avatar: 'dm-avatar.png',
  },
  {
    projectImage: 'contribute.png',
    projectUrl: 'https://olas.network/services/agentsfun',
    quote:
      'Launch your own AI influencer agent that can autonomously market a business or concept for you. We chose to build this on Olas due to the ability to enable people to easily own and operate their own agents via Pearl - the agent app store. Pearl not only allows us to bootstrap users via Olas staking, but also provides a way for people to take ownership of their AI influencers and earn a steady revenue stream.',
    name: 'Anonymous Olas Contributor',
    avatar: 'anon-avatar.png',
  },
  {
    projectImage: 'optimism.png',
    projectUrl: 'https://www.optimism.io/',
    quote:
      "Thrilled to have Optimus, the first AI agent-powered DeFi management across Superchain, enabling users to seamlessly optimize yield regardless of what chain OP chain they're using.",
    name: 'Josh Wadinski',
    title: 'Optimism',
    avatar: 'anon-avatar.png',
  },
];

export const WhatLaunchersAreSaying = () => (
  <TestimonySection
    id="social-proof"
    isQuote
    folderName="launch-page"
    title="What Launchers are saying"
    list={quotes}
  />
);
