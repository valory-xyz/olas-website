import { SUB_HEADER_LG_CLASS } from "common-util/classes";
import { InfoCardList } from "components/InfoCardList";
import SectionWrapper from "components/Layout/SectionWrapper";
import { BicepsFlexed, HandCoins, Sparkles, Target } from "lucide-react";

const list = [
  {
    title: "Innovation",
    icon: <Sparkles color="#606F85" />,
    desc: "Harnesses the power of autonomous agents to optimize DeFi asset management.",
  },
  {
    title: "Novel UX",
    icon: <BicepsFlexed color="#606F85" />,
    desc: "Users don't need to understand the underlying DeFi primitives. Their agent takes care of the complexities.",
  },
  {
    title: "Profit Potential",
    icon: <HandCoins color="#606F85" />,
    desc: "Operators run trader agents to earn staking rewards and engage in autonomous DeFi asset management.",
  },
  {
    title: "Specialization",
    icon: <Target color="#606F85" />,
    desc: "Agents specialize in roles for optimal performance and operator UX (e.g. Traders require trading capital, Mechs require access to AI models).",
  },
];

export const WhyOlasOptimus = () => (
  <SectionWrapper customClasses={"py-8 px-6 lg:pt-24"}>
    <div
      className="max-w-screen-xl lg:px-44 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12"
      id="why-olas-optimus"
    >
      <h2
        className={`${SUB_HEADER_LG_CLASS} text-left mb-8 lg:text-center lg:mb-14`}
      >
        Why Olas Optimus?
      </h2>
      <InfoCardList cards={list} />
    </div>
  </SectionWrapper>
);
