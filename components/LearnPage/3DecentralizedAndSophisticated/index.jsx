import Image from 'next/image';
import React from 'react';

const DATA_ROWS = [
  // ... (DATA_ROWS content remains unchanged)
];

const getChainType = (type) => (type ? 'ON-CHAIN' : 'OFF-CHAIN');

const WhyOlas = () => (
  <div className="py-14 text-center" id="what-are-autonomous-services">
    <h2 className="mb-8">WHAT ARE AUTONOMOUS SERVICES?</h2>
    <div
      className="text-6xl font-bold mb-8"
    >
      Decentralized&nbsp;
      <br />
      <span className="sub-text">and</span>
          &nbsp;
      <span className="ib">Sophisticated</span>
    </div>

    <h2 className="mb-8">
      Software services you can build and own. Build with the best of smart
      contracts and Web2 apps.
    </h2>

    <Image src="/images/learn/3Decentralized/what-are-autonomous-services.png" alt="What are autonomous services" className="mx-auto" width={575} height={522} />
  </div>
);

export default WhyOlas;
