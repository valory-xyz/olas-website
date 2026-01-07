import { SECTION_BOX_CLASS, SUB_HEADER_CLASS } from 'common-util/classes';
import { InfoCardList } from 'components/InfoCardList';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Link } from 'components/ui/typography';

const list = [
  {
    title: 'Direct OLAS emissions to ecosystem roles',
    desc: "Directly vote on how OLAS emissions are distributed. Your choices help grow the projects and agents that you believe are most valuable to the ecosystem's growth.",
  },
  {
    title: 'Browse & vote on proposals',
    desc: 'Your vote matters. Participate in the decision-making process on critical proposals that shape the future of the Olas platform, ensuring it aligns with your vision for blockchain technology.',
  },
  {
    title: 'Propose new ideas',
    desc: 'Propose new ideas or changes within the Olas ecosystem. As a governor, you have the platform to set the agenda and drive innovation.',
  },
  {
    title: 'Shape the road ahead',
    desc: (
      <>
        <span className="mb-3 flex">
          Directly steer Olas&apos;s development, ensuring a future where every
          update and growth strategy is community-driven and transparent.
        </span>
        <Link href="/roadmap">View roadmap</Link>
      </>
    ),
  },
];

export const WhyBecomeGovernor = () => (

  <SectionWrapper customClasses={`${SECTION_BOX_CLASS} lg:pt-16 lg:pb-12`}>
    <div
      className="max-w-screen-xl lg:px-12 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12"
      id="why-govern"
    >
      <h2
        className={`${SUB_HEADER_CLASS} text-left mb-8 lg:text-center lg:mb-14`}
      >
        Why become an Olas Governor?
      </h2>
      // @ts-expect-error TS(2322) FIXME: Type '({ title: string; desc: string; } | { title:... Remove this comment to see the full error message
      <InfoCardList cards={list} />
    </div>
  </SectionWrapper>
);
