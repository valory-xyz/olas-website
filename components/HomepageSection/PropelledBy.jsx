import Link from 'next/link';
import Image from 'next/image';

import SectionWrapper from 'components/Layout/SectionWrapper';
import chains from 'data/chains.json';
import builders from 'data/builders.json';
import friends from 'data/friends.json';
import SectionHeading from '../SectionHeading';

// hide those we don't have enough data to display, e.g. links
// or because they are not live yet
const filteredFriends = friends.filter((friend) => !friend.hidden);

export const Chains = () => (
  <section id="builders" className="max-w-screen-xl mx-auto text-center mb-28">
    <SectionWrapper
      id="chains"
      customClasses="px-8 max-w-screen-xl w-full mx-auto"
    >
      <h3 className="text-2xl md:text-4xl font-bold">Chains</h3>

      <p className="text-slate-700 text-xl max-w-[800px] mx-auto py-8">
        Olas Protocol is available on a growing list of chains. When Olas
        Protocol is deployed on a chain, it brings the power of Olas to that
        chain&apos;s ecosystem.
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {chains.map((chain) => (
          <a
            key={chain.id}
            className="block rounded-xl border border-gray-300 shadow-sm hover:border-gray-300 hover:shadow-lg focus:outline-none focus:ring"
            target="_blank"
            rel="noopener noreferrer"
            href={chain.url}
          >
            <SectionWrapper customClasses="rounded-t-xl border-t-0 border-b">
              <div className="flex">
                <Image
                  src={`/images/chains/${chain.iconFilename}`}
                  alt={chain.name}
                  width={150}
                  height={300}
                  className="mx-auto p-4 my-auto w-full h-[200px] "
                />
              </div>
            </SectionWrapper>
            <div className="p-4 md:p-6 lg:p-4">
              <h2 className="font-bold text-xl text-gray-700">{chain.name}</h2>
            </div>
          </a>
        ))}
      </div>
    </SectionWrapper>
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
  <SectionWrapper>
    <SectionHeading
      color="text-gray-900"
      weight="font-bold"
      other="max-w-[616px] mb-24 text-center mx-auto"
    >
      Propelled by a growing ecosystem
    </SectionHeading>
    <Chains />
    <Builders />
    <MoreFriends />
  </SectionWrapper>
);

export default PropelledBy;
