import Image from 'next/image';
import Link from 'next/link';

import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import {
  CTA, SECTION_BOX_CLASS, SUB_HEADER_CLASS, TEXT_CLASS,
} from './utils';

const controlList = [
  {
    title: 'Customize, experiment, and optimize your agents',
    desc: 'With the Quickstarts, listed on the Operate site, you’re in charge. Select an agent, tweak settings, and tailor operations to your specifications. It’s your setup, your rules. Run as many agents as you like.',
  },
  {
    title: 'Quick setup guides',
    desc: 'Follow easy steps to get started and make adjustments on the fly.',
  },
  {
    title: 'Configurable',
    desc: 'Modify and manage your agent directly, optimizing as you see fit.',
  },
  {
    title: 'Start now',
    desc: 'Dive into a more hands-on experience and shape your digital journey.',
  },
];

export function WantMoreControl() {
  return (
    <SectionWrapper customClasses={`${SECTION_BOX_CLASS}`}>
      <div className="grid items-center max-w-screen-xl mx-auto lg:grid-cols-12 lg:pl-8">
        <div className="px-0 mr-12 lg:col-span-6 lg:p-0 lg:px-5">
          <h2 className={`${SUB_HEADER_CLASS} mb-4 lg:mb-6`}>
            Want more control?
          </h2>

          <div>
            {controlList.map((each, index) => (
              <div key={index} className="py-4">
                <h2 className="text-lg font-semibold mb-1">{each.title}</h2>
                <p className={TEXT_CLASS}>{each.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 lg:col-span-6 lg:flex lg:mt-0">
          <Image
            className="mx-auto border shadow-xl"
            alt="OLAS Utility"
            src="/images/operate-page/how-it-works.png"
            width="540"
            height="574"
          />
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <Button asChild variant="ghostPrimary" size="xl">
          <Link href={CTA}>Browse agents to run manually</Link>
        </Button>
      </div>
    </SectionWrapper>
  );
}
