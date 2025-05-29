import { GetInvolvedCards } from 'components/GetInvolvedCards';

const { default: SectionWrapper } = require('components/Layout/SectionWrapper');
const { MoveUpRight } = require('lucide-react');

const resources = [
  {
    title: 'Contribute a strategy',
    description:
      'Built a trading bot? Expert trader? Share your knowledge and add to the strategy library.',
    url: 'https://discord.gg/RHY6eJ35ar',
    urlName: 'Reach out on Discord',
  },
  {
    title: 'Join as an Alpha tester',
    description: 'Keen on being at the forefront of trading innovation?',
    url: 'https://discord.gg/RHY6eJ35ar',
    urlName: 'Reach out on Discord',
  },
];

export const FurtherResources = () => (
  <GetInvolvedCards title="Further resources" list={resources} />
);
