import Link from 'next/link';
import Image from 'next/image';

import SectionWrapper from 'components/Layout/SectionWrapper';
import chains from 'data/chains.json';
import builders from 'data/builders.json';
import friends from 'data/friends.json';
import SectionHeading from '../SectionHeading';

export const Chains = () => (
  <section
    id="chains"
    className="max-w-screen-lg mx-auto text-center mb-28 scroll-m-28"
  >
    <h3 className="text-2xl md:text-4xl font-bold">Chains</h3>
    <p className="text-slate-700 text-xl max-w-[800px] mx-auto py-12">
      Olas Protocol is available on a growing list of chains. When Olas Protocol
      is deployed on a chain, it brings the power of Olas to that chain&apos;s
      ecosystem.
    </p>

    <div className="grid grid-cols-2 gap-10  sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
      {chains.map((chain) => (
        <div key={chain.id} className="flex justify-center items-center">
          <a target="_blank" rel="noopener noreferrer" href={chain.url}>
            <Image
              src={`/images/chains/${chain.iconFilename}`}
              alt={chain.name}
              width={150}
              height={30}
            />
          </a>
        </div>
      ))}
    </div>
  </section>
);

export const Builders = () => (
  <section id="builders" className="max-w-screen-xl mx-auto text-center mb-28">
    <h3 className="text-2xl md:text-4xl font-bold mb-4">Builders</h3>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-10 ">
      {builders.map((builder) => {
        const {
          id, name, url, iconFilename,
        } = builder;
        return (
          <div key={id} className="grayscale flex justify-center items-center">
            <a href={url} target="_blank" rel="noopener noreferrer">
              <Image
                src={`/images/builders/${iconFilename}`}
                alt={name}
                width={150}
                height={30}
              />
            </a>
          </div>
        );
      })}
    </div>
  </section>
);

// hide those we don't have enough data to display, e.g. links
// or because they are not live yet
const filteredFriends = friends.filter((friend) => !friend.hidden);
const MoreFriends = () => (
  <section id="friends" className="max-w-screen-xl mx-auto text-center">
    <h3 className="text-2xl md:text-4xl font-bold mb-12">
      More friends of Olas
    </h3>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-14">
      {filteredFriends.map((friend) => {
        const {
          id,
          name,
          url,
          isExternal,
          imageFilename,
          imageWidth,
          imageHeight,
        } = friend;
        const LinkTag = isExternal ? 'a' : Link;
        return (
          <div key={id} className="grayscale flex justify-center items-center">
            <LinkTag
              href={url}
              {...(isExternal
                ? {
                  target: '_blank',
                  rel: 'noopener noreferrer',
                }
                : {})}
            >
              <Image
                src={`/images/friends/${imageFilename}`}
                alt={name}
                width={imageWidth ?? 150}
                height={imageHeight ?? 30}
              />
            </LinkTag>
          </div>
        );
      })}
    </div>
  </section>
);

export const PropelledBy = () => (

  <SectionWrapper customClasses="px-4 md:px-8 py-12 md:py-24" id="ecosystem">
    <SectionHeading
      size="max-sm:text-5xl"
      color="text-gray-900"
      weight="font-bold"
      other="max-w-[616px] max-sm:mb-12 mb-24 text-center mx-auto"
    >
      Propelled by a growing ecosystem
    </SectionHeading>
    <Chains />
    <Builders />
    <MoreFriends />
  </SectionWrapper>
);

export default PropelledBy;
