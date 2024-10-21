import { SUB_HEADER_CLASS } from "common-util/classes";
import SectionWrapper from "components/Layout/SectionWrapper";
import Image from "next/image";

const types = [
  {
    id: "Trader",
    src: "/images/predict-page/traders.png",
    desc: "Finds the best DeFi opportunities and makes smart investments.",
    linkText: "More about Optimus Trader agent",
    link: "/services/babydegen",
  },
  {
    id: "Mech",
    src: "/images/predict-page/mechs.png",
    desc: "Operating as the Olas Mech agent economy, Mechs provide intelligence for Trader agents for managing DeFi assets.",
    linkText: "More about Olas Mech agent economy ",
    link: "/agent-economies/mech",
  },
];

const WhatIsOptimus = () => (
  <div>
    <h1 className={`${SUB_HEADER_CLASS} font-semibold text-left text-4xl mb-8`}>
      What is Olas Optimus?
    </h1>
    <p className="mb-20">
      The Olas Optimus agent economy is a multi-agent system of autonomous AI
      agents to streamline your DeFi experience. An autonomous AI agent
      intelligently manages your assets on specific blockchain platforms. <br />
      It strategically targets high-yield opportunities, optimizing your returns
      within ecosystems like Optimism Mainnet and Base.
    </p>
  </div>
);

const AgentTypes = () => (
  <>
    <h2 className="text-left text-2xl font-semibold tracking-tight my-3">
      Agent types
    </h2>
    <div className="grid grid-cols-1 gap-4 md:gap-0 my-8">
      {types.map((item, index) => {
        let borderClassName = "border-b-1.5 pb-6";
        if (index % 2 !== 0) borderClassName = "md:pt-6";

        return (
          <div
            key={item.id}
            className={`flex flex-col gap-3 mb-3 text-start border-gray-300 ${borderClassName}`}
          >
            <Image alt="Optimus" src={item.src} width="72" height="32" />
            <span className="text-xl font-semibold text-black">{item.id}</span>
            <p>{item.desc}</p>

            <a
              href={item.link}
              className="mt-auto text-purple-600"
              target="_blank"
            >
              {item.linkText} ↗
            </a>
          </div>
        );
      })}
    </div>
  </>
);

export const WhatIsOlasOptimus = () => (
  <SectionWrapper customClasses="px-6 mx-auto max-w-screen-sm">
    <WhatIsOptimus />
    <AgentTypes />
  </SectionWrapper>
);
