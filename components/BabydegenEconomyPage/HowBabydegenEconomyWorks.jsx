import { HowItWorks } from 'components/HowItWorks';

const list = [
  {
    title: 'Data Gathering',
    description:
      'BabyDegen pulls real-time market data from CoinGecko to stay up to date.',
    imgSrc: 'data-gathering',
  },
  {
    title: 'Strategy Selection',
    description:
      'It picks the most effective strategy from a growing library based on current market conditions.',
    imgSrc: 'strategy-selection',
  },
  {
    title: 'Making Moves',
    description:
      "Powered by live data and its trading experience, BabyDegen evaluates when to buy, sell, or hold assets across supported DeFi protocols. Popular platforms include Balancer, Uniswap, and others, depending on the agent's strategy.",
    imgSrc: 'making-moves',
  },
];

export const HowBabydegenEconomyWorks = () => (
  <div id="how-it-works">
    <HowItWorks
      headerText="How Babydegen Economy Works"
      imgFolder="babydegen-econ-page"
      list={list}
    />
  </div>
);
