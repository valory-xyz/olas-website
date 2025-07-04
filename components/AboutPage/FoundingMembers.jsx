import { SUB_HEADER_MEDIUM_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Tag } from 'components/ui/tag';
import { BubbleRing } from './BubbleRing';

export const FoundingMembers = () => (
  <SectionWrapper id="founding-members" backgroundType="GRAY">
    <div className=" max-w-[1096px] mx-auto mb-24 md:mb-[120px] gap-12 flex flex-col-reverse md:flex-row items-center md:items-start justify-between">
      <div>
        <Tag variant="primary" className="mb-12 w-full">
          Olas Founding Members
        </Tag>
        <BubbleRing />
      </div>
      <div className="md:max-w-[536px] flex flex-col gap-6">
        <h2 className={SUB_HEADER_MEDIUM_CLASS}>
          In 2021, a group of builders, innovators and dreamers realized that
          the world doesn&apos;t just need powerful AI - it needs powerful AI
          that{' '}
          <span className="border-b-4 border-purple-300">
            belongs to everyone
          </span>
        </h2>
        <p>
          So, they envisioned something radical - a truly open network where
          everyone could run, build, own and participate in AI.{' '}
          <span className="font-semibold">
            Not just as users, but owners of it.
          </span>
        </p>
        <p>
          They called it Olas — crypto&apos;s ocean of agents. And from a small
          DAO of 50, they created{' '}
          <span className="font-semibold">
            one of the very first projects at the intersection of Crypto x AI.
          </span>
        </p>
      </div>
    </div>

    <p
      className={`${SUB_HEADER_MEDIUM_CLASS} max-w-[872px] m-auto text-center my-12`}
    >
      Today, Olas coordinates the growth of autonomous AI Agents that trade,
      influence, and predict on behalf of their owners. These are already
      creating value through millions of transactions each month
    </p>
    <p className="w-max text-center m-auto border-b-4 border-purple-300">
      And it&apos;s just getting started
    </p>
  </SectionWrapper>
);
