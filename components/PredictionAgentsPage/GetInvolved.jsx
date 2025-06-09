import { DISCORD_INVITE_URL } from 'common-util/constants';
import { GetInvolvedCards } from 'components/GetInvolvedCards';

const list = [
  {
    title: 'Contribute a Strategy',
    desc: 'Built a trading bot? Expert trader? Share your knowledge and add to the strategy library.',
    urlName: 'Reach out on Discord',
    url: { DISCORD_INVITE_URL },
    isExternal: true,
  },
  {
    title: 'Build the Future of Autonomous AI Trading',
    desc: 'Developer, innovator, or AI enthusiast? Build with the Olas stack and help shape the future of autonomous AI trading.',
    urlName: 'Build on Olas',
    url: '/build',
    isExternal: false,
  },
];

export const GetInvolved = () => <GetInvolvedCards list={list} />;
