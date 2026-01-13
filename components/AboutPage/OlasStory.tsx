import { SUB_HEADER_MEDIUM_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Tag } from 'components/ui/tag';
import Image from 'next/image';

export const OlasStory = () => (
  <SectionWrapper id="olas-story" backgroundType="GRAY">
    <div className="max-w-[1096px] mx-auto">
      <Tag variant="primary" className="mb-6">
        The Olas Story
      </Tag>
      <div className="flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="md:max-w-[536px] flex flex-col gap-6">
          <h2 className={SUB_HEADER_MEDIUM_CLASS}>AI is changing the world at breakneck speed</h2>
          <p>
            AI is getting better and stronger each day, and with this comes the risk of its
            ownership getting more and more centralized. Labs like OpenAI, Anthropic, and DeepMind
            are building AI Agents that they hope to soon run everything. If unchecked, this creates
            a world where the{' '}
            <span className="font-semibold">
              best AI is being owned by the few and rented by the many.
            </span>
          </p>
          <p>
            For everyone who dreams about AI Agents that could satisfy your every wish or would
            revolutionize industries and change the world for the better,{' '}
            <span className="font-semibold">
              there will always be a price: pay the tax forever, or get left behind.
            </span>
          </p>
        </div>
        <Image src="/images/about/story.png" alt="Agent economies" width={408} height={351} />
      </div>
    </div>
  </SectionWrapper>
);
