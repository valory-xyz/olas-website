import Image from 'next/image';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { TEXT } from 'styles/globals';
import { Button } from 'components/Button';
import { CTA, SECTION_BOX_CLASS, SUB_HEADER_CLASS } from './utils';

const controlList = [
  {
    title: 'Customize, experiment, and optimize your agents',
    desc: 'With the Olas Operate interface, you’re in charge. Select an agent, tweak settings, and tailor operations to your specifications. It’s your setup, your rules.',
  },
  {
    title: 'Quick setup guides',
    desc: 'Follow easy steps to get started and make adjustments on the fly.',
  },
  {
    title: 'Full control',
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
      <div className="grid max-w-screen-xl lg:pl-12 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12 items-center">
        <div className=" px-0 mr-12 lg:col-span-6 lg:p-0 lg:px-5">
          <h2 className={SUB_HEADER_CLASS}>Want more control?</h2>

          <div>
            {controlList.map((each, index) => (
              <div key={index} className="py-4 rounded-lg text-gray-600">
                <div className={`flex items-center mb-1 ${TEXT}`}>
                  <h2 className="font-semibold">{each.title}</h2>
                </div>

                <p className="">{each.desc}</p>
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
        <Button href={CTA} isHoverCssEnabled={false} type="secondary">
          Browse agents to run manually
        </Button>
      </div>
    </SectionWrapper>
  );
}
