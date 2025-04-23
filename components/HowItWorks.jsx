import { SUB_HEADER_CLASS, TEXT_LARGE_CLASS } from 'common-util/classes';
import Image from 'next/image';
import SectionWrapper from './Layout/SectionWrapper';

export const HowItWorks = ({ headerText, description, imgFolder, list }) => (
  <SectionWrapper
    id="how-it-works"
    customClasses="max-w-4xl m-6 md:m-16 lg:mx-auto lg:pb-16"
  >
    <div className="mb-16">
      <h2 className={`${SUB_HEADER_CLASS} mb-6`}>{headerText}</h2>
      {description && <div>{description}</div>}
    </div>
    <div className="flex flex-col gap-12 lg:gap-24">
      {list.map((item) => (
        <div
          key={item.title}
          className="flex flex-col md:flex-row justify-between gap-8"
        >
          <div className="flex flex-col max-w-[400px]">
            <h3 className={`${TEXT_LARGE_CLASS} font-bold mb-2`}>
              {item.title}
            </h3>
            <div>{item.description}</div>
          </div>
          <Image
            alt={item.title}
            src={`/images/${imgFolder}/${item.imgSrc}.png`}
            width={408}
            height={408}
            className="md:max-lg:w-[300px]"
          />
        </div>
      ))}
    </div>
  </SectionWrapper>
);
