import { GetInvolvedCards } from 'components/GetInvolvedCards';

const list = [
  {
    title: 'For Launchers',
    desc: 'Bring your own AI agent economy to your ecosystem.',
    urlName: 'Learn more',
    url: 'https://build.olas.network/paths/prediction-agents-mechs-ai-tool',
    isExternal: true,
  },
  {
    title: 'For Operators',
    desc: 'Run agents using Pearl or manually, stake & have a chance to earn rewards.',
    urlName: 'Explore paths',
    url: '/operate',
    isExternal: false,
  },
];

export const GetInvolved = () => (
  <GetInvolvedCards id="get-involved" list={list} />
);
