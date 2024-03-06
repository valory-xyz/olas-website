import React from 'react';
import { useRouter } from 'next/router';

import kits from 'data/kits.json';
import { BUTTON } from 'styles/globals';
import { DOCS_BASE_URL } from 'common-util/constants';
import Meta from '../Meta';

export const KitPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const kit = kits.find((kit) => kit.id === id);

  if (!kit) {
    return <div>Kit not found</div>;
  }

  return (
    <>
      <Meta title={kit.title} description={kit.description} />
      <section className="bg-white text-black py-16 px-4 border-y">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2">
            <h1 className="text-6xl font-bold mb-6">{kit.title}</h1>
            <p className="text-xl mb-6">{kit.description}</p>
            <a className={`${BUTTON} mr-4`} href={kit.liveLink.url} target={kit.liveLink.external ? '_blank' : '_self'} rel={kit.liveLink.external ? 'noopener noreferrer' : ''}>
              See live demo
            </a>
            <a className={BUTTON} href={`${DOCS_BASE_URL}/product/${kit.id}kit`} target={kit.liveLink.external ? '_blank' : '_self'} rel={kit.liveLink.external ? 'noopener noreferrer' : ''}>
              Docs
            </a>
          </div>
          <div className="md:w-1/2 flex justify-center mt-10 md:mt-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={`${kit.title} Illustration`}
              src={`/images/kits/${kit.id}kit.svg`}
              height="300"
              width="300"
            />
          </div>
        </div>
      </section>
    </>
  );
};
