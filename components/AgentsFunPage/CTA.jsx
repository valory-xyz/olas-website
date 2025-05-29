import { LAUNCH_URL } from 'common-util/constants';
import { GetInvolvedCards } from 'components/GetInvolvedCards';

const list = [
  {
    title: 'For Launchers',
    desc: 'Bring your own AI agent economy to your ecosystem.',
    urlName: 'Learn more',
    url: LAUNCH_URL,
  },
  {
    title: 'For Operators',
    desc: 'Run agents using Pearl or manually, stake & have a chance to earn rewards.',
    urlName: 'Explore paths',
    url: '/operate',
  },
];

export const CTA = () => <GetInvolvedCards list={list} />;
