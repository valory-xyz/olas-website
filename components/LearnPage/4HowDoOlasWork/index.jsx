import { TITLE } from "@/styles/globals";
import Image from "next/image";

const DATA = [
  'Services are made up of open-source software agents',
  'Each agent is operated  independently',
  'Services run continuously',
  'Services get data from any data source',
  'They can do complex stuff, even machine learning',
  'Service agents robustly come to consensus about what action to take',
  'Services take action on any chain or API',
];

const WhatAreWeBuilding = () => (
  <section className="section-4 py-10" id="how-do-autonomous-services-work">
    <div className={TITLE.SMALL}>
      How do autonomous
      <br />
      services work?
    </div>

    <div className="flex">
      <div className="flex-1">
        <div className="img-container">
          <Image
            src="/images/learn/4HowDoOlasWork/main.svg"
            alt="How do autonomous services work?"
            width={500}
            height={500}
          />
        </div>
      </div>

      <div className="flex-1">
        {DATA.map((item, index) => (
          <div className="content my-4" key={`how-olas-${index}`}>
            <div className="sr-no w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-4">{index + 1}</div>
            <div className="text">{item}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhatAreWeBuilding;
