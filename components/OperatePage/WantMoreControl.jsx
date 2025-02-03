import Image from 'next/image';
import Link from 'next/link';

import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import { CTA, SECTION_BOX_CLASS, TEXT_CLASS } from './utils';

const controlList = [
  {
    desc: 'For technically advanced users, Quickstart offers complete flexibility to configure, customize and optimize agents using the command line interface (CLI).',
  },
  {
    title: 'Customize on your own',
    desc: 'Tailor your agents to fit your exact needs, from settings to operations.',
  },
  {
    title: 'Configurable',
    desc: 'Directly manage your agent setup and configurations.',
  },
  {
    title: 'Enjoy ∞ agents',
    desc: 'Run as many agents as you like.',
  },
];

export function WantMoreControl() {
  return (
    <SectionWrapper customClasses={`${SECTION_BOX_CLASS}`}>
      <div className="grid items-center max-w-screen-xl mx-auto lg:grid-cols-12 lg:pl-8">
        <div className="px-0 mr-12 lg:col-span-6 lg:p-0 lg:px-5">
          <h2 className="tracking-tight text-3xl lg:text-4xl text-left mb-8 font-semibold lg:text-center">
            Take full control with Quickstart
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

        <Button variant="ghostPrimary" size="xl" className="w-fit mt-4">
          <Link href={CTA} target="_blank" rel="noopener noreferrer">
            Browse agents and start now
          </Link>
        </Button>
      </div>
    </SectionWrapper>
  );
}
