import Image from 'next/image';

const LIST = [
  {
    imageUrl: 'open-source',
    heading: 'OPEN-SOURCE FRAMEWORK',
    subHeading: 'Ruby on Rails for building autonomous services',
  },
  {
    imageUrl: 'on-chain-protocol',
    heading: 'ON-CHAIN PROTOCOL',
    subHeading: 'For securing autonomous services and taking action on-chain',
  },
  {
    imageUrl: 'ecosystem',
    heading: 'ECOSYSTEM',
    subHeading: 'Autonomous services running and being used by DAOs',
  },
];

const WhatIsOlas = () => (
  <section className="section bg-gray-100 py-10 rounded-lg" id="what-is-olas">
    <div className="max-w-4xl mx-auto px-4">
      <h2 className="text-3xl font-bold mb-6">LEARN</h2>

      <div className="text-5xl font-bold mb-6">
        What&nbsp;
        <span className="text-3xl">is&nbsp;</span>
        Olas?
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {LIST.map((item) => (
          <div key={item.imageUrl} className={`flex flex-col items-center p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 bg-white`}>
            <div className="w-24 h-24 mb-4">
              <Image
                src={`/images/learn/2WhatIsOlas/${item.imageUrl}.png`}
                alt={`${item.heading} Icon`}
                width={96}
                height={96}
                className="object-contain"
              />
            </div>
            <div className="text-xl font-semibold mb-2">{item.heading}</div>
            <div className="text-md">{item.subHeading}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhatIsOlas;

