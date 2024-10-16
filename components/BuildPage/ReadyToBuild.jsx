import { TEXT_MEDIUM_LIGHT_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card, CardTitle } from 'components/ui/card';
import Image from 'next/image';

const content = [
  {
    title: 'Build paths',
    imageSrc: '/images/build-page/build-paths.png',
    description:
      'Follow structured paths to streamline your development process.',
    linkText: 'Get started with Build paths',
    link: 'https://build.olas.network/paths',
  },
  {
    title: 'Comprehensive docs',
    imageSrc: '/images/build-page/docs.png',
    description: 'Dive deep with our detailed documentation.',
    linkText: 'Review Olas documentation',
    link: 'https://docs.autonolas.network',
  },
];

export const ReadyToBuild = () => (
  <SectionWrapper
    backgroundType="NONE"
    customClasses=" pt-8 pb-16 md:pb-24 px-4 border-b"
    id="grow"
  >
    <p className={`${TEXT_MEDIUM_LIGHT_CLASS} text-center mb-3`}>
      READY TO BUILD?
    </p>
    <h2 className="text-4xl lg:mb-6 xl:mb-8 font-extrabold my-6 lg:my-auto text-center">
      Jump right in
    </h2>

    <div className="grid md:grid-cols-2 md:gap-x-4 gap-x-10 gap-y-4 max-w-5xl mx-auto ">
      {content.map((item) => (
        <Card
          className="bg-gradient-to-t from-[#EEF0F7] to-[#FCFCFD] flex flex-col overflow-hidden border-t border-gray-200"
          key={item.title}
        >
          <Image
            src={item.imageSrc}
            alt={item.title}
            width={495}
            height={260}
            className="rounded-lg py-auto object-cover w-full"
          />
          <div className="p-6 py-8 flex flex-col h-full">
            <CardTitle className="mb-4 text-left">
              <span>{item.title}</span>
            </CardTitle>
            <div className="mb-2 text-start">{item.description}</div>
            <a
              href={item.link}
              className="mt-auto text-purple-600"
              target="_blank"
            >
              {item.linkText} ↗
            </a>
          </div>
        </Card>
      ))}
    </div>
  </SectionWrapper>
);
