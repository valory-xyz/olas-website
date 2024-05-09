import Image from 'next/image';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { TEXT } from 'styles/globals';
import SectionHeading from '../SectionHeading';

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
    <SectionWrapper customClasses="lg:p-24 px-4 py-12">
      <div className="grid max-w-screen-xl lg:pl-12 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12 items-center">
        <div className="lg:col-span-6 px-5 lg:p-0 mr-12">
          <SectionHeading spacing="mb-8">Want more control?</SectionHeading>

          <div>
            {controlList.map((each, index) => (
              <div
                key={index}
                className="py-4 rounded-lg text-gray-600"
              >
                <div className={`flex items-center mb-1 ${TEXT}`}>
                  <h2 className="font-semibold">{each.title}</h2>
                </div>

                <p className="">{each.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:mt-0 lg:col-span-6 lg:flex">
          <Image
            className="mx-auto border shadow-xl"
            alt="OLAS Utility"
            src="/images/operate-page/how-it-works.png"
            width="540"
            height="574"
          />
        </div>
      </div>
    </SectionWrapper>
  );
}
