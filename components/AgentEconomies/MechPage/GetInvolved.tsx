import { BUILD_URL } from 'common-util/constants';
import { GetInvolvedCards } from 'components/GetInvolvedCards';
import { Button } from 'components/ui/button';
import Link from 'next/link';

const list = [
  {
    title: 'For Builders',
    desc: 'Contribute to Mechs AI tools marketplace for agents and have a chance to earn Dev Rewards.',
    urlName: 'Start building',
    url: BUILD_URL,
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
    urlName: 'Explore paths',
    url: '/operate',
    isExternal: false,
  },
];

const MechAgentsCta = () => (
  <Button variant="default" size="xl" asChild className="max-md:w-full">
    <Link href="/agents/ai-mechs">Learn about Mech agents</Link>
  </Button>
);

export const GetInvolved = () => <GetInvolvedCards list={list} cta={<MechAgentsCta />} />;
