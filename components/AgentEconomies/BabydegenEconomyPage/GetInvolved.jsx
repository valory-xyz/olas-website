import { BUILD_MECH_TOOL_URL } from 'common-util/constants';
import { GetInvolvedCards } from 'components/GetInvolvedCards';

const list = [
  {
    title: 'For Launchers',
    desc: 'Bring your own AI agent economy to your ecosystem.',
    urlName: 'Learn more',
    url: BUILD_MECH_TOOL_URL,
    isSubsite: true,
  },
  {
    title: 'For Operators',
    desc: 'Run agents using Pearl or manually, stake & have a chance to earn rewards.',
    urlName: 'Explore paths',
    url: '/operate',
    isExternal: false,
  },
];

export const GetInvolved = () => <GetInvolvedCards list={list} />;
