import { GetInvolvedCards } from 'components/GetInvolvedCards';

const list = [
  {
    title: 'For Builders',
    desc: 'Contribute to Mechs AI tools marketplace for agents and have a chance to earn Dev Rewards.',
    urlName: 'Coming soon',
    url: '#',
    isExternal: false,
    isDisabled: true,
  },
  {
    title: 'For Launchers',
    desc: 'Bring your own AI agent economy to your ecosystem.',
    urlName: 'Learn more',
    url: '/launch',
    isExternal: false,
  },
  {
    title: 'For Operators',
    desc: 'Run agents using Pearl or manually, stake & have a chance to earn rewards.',
    urlName: 'Run Optimus agent',
    url: '/operate',
    isExternal: false,
  },
];

export const GetInvolved = () => <GetInvolvedCards list={list} />;
