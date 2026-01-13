import { DISCORD_INVITE_URL } from 'common-util/constants';
import { GetInvolvedCards } from 'components/GetInvolvedCards';

const resources = [
  {
    title: 'Contribute a strategy',
    description:
      'Built a trading bot? Expert trader? Share your knowledge and add to the strategy library.',
    url: DISCORD_INVITE_URL,
    urlName: 'Reach out on Discord',
    isExternal: true,
  },
  {
    title: 'Join as an Alpha tester',
    description: 'Keen on being at the forefront of trading innovation?',
    url: DISCORD_INVITE_URL,
    urlName: 'Reach out on Discord',
    isExternal: true,
  },
];

export const FurtherResources = () => (
  <GetInvolvedCards id="babydegen-resources" title="Further resources" list={resources} />
);
