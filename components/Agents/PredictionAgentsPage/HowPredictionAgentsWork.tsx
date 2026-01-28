import { HowItWorks } from 'components/HowItWorks';
import Link from 'next/link';

const list = [
  {
    title: 'Find Market Opportunities',
    description:
      'Omenstrat constantly scans active prediction markets to identify new opportunities for investment.',
    imgSrc: 'market-opportunities',
  },
  {
    title: 'Make Intelligent Predictions',
    description: (
      <div>
        The agent accesses the{' '}
        <Link href="/mech-marketplace" className="text-purple-600">
          AI Agent Bazaar (Mech Marketplace)
        </Link>{' '}
        to procure data from trusted information brokers. Mechs use external AI tools to analyze
        real-time news and data, calculating the most likely outcomes to inform its trading
        strategy.
      </div>
    ),
    imgSrc: 'intelligent-predictions',
  },
  {
    title: 'Makes Smart Trades',
    description:
      'Based on the AI-generated probabilities, the agent automatically places trades in markets with the highest confidence.',
    imgSrc: 'smart-bets',
  },
  {
    title: 'Collect Earnings',
    description:
      'If the prediction is correct, the agent collects its winnings on your behalf as soon as the market is finalized — no manual action required.',
    imgSrc: 'collect-earnings',
  },
];

export const HowPredictionAgentsWork = () => (
  <HowItWorks
    headerText="How It Works"
    description="Fund Omenstrat and benefit from its autonomous labor. It finds markets, execute trades, and collects rewards — all without manual input."
    imgFolder="prediction-agents-page"
    list={list}
  />
);
