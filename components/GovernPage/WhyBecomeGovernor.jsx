import {
  SUB_HEADER_CLASS,
  SECTION_BOX_CLASS,
  TEXT_CLASS,
} from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';

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
    desc: "Directly steer Olas's development, ensuring a future where every update and growth strategy is community-driven and transparent.",
  },
];

const eachCardCss = {
  background:
    'linear-gradient(94.05deg, #F2F4F9 0%, rgba(242, 244, 249, 0) 100%)',
};

export const WhyBecomeGovernor = () => (
  <SectionWrapper customClasses={`${SECTION_BOX_CLASS} lg:pt-16 lg:pb-12`}>
    <div
      className="max-w-screen-xl lg:px-12 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12"
      id="why-become-governor"
    >
      <h2
        className={`${SUB_HEADER_CLASS} text-left mb-8 lg:text-center lg:mb-14`}
      >
        Why become an Olas Governor?
      </h2>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {list.map(({ title, desc }) => (
          <div
            key={title}
            className="flex flex-col gap-3 bg-gradient-to-r p-4 rounded-xl border lg:p-6"
            style={eachCardCss}
          >
            <h2 className="text-xl font-semibold">{title}</h2>

            <p className={TEXT_CLASS}>{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </SectionWrapper>
);
