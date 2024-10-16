import { Cross2Icon } from '@radix-ui/react-icons';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card, CardTitle } from 'components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Content from './Content';

const ways = [
  {
    title: 'Earn Dev Rewards by building on Olas Protocol',
    imageSrc: '/images/build-page/earn-dev-rewards.jpg',
    description: (
      <>
        <p className="mb-4">
          Contribute valuable code units — like agents or components — to the
          Olas protocol and have a chance at receiving Developer Rewards.
        </p>
        <p className="mb-4">
          Dev Rewards is a part of the protocol that facilitates the
          distribution of capital to developers who contribute to various
          services in the ecosystem.
        </p>
        <p>
          This system is designed to reward both the contribution of code
          components and entire agents.
        </p>
      </>
    ),
    showDevRewards: (setDevRewardsOpen) => (
      <a
        className="text-purple-600 cursor-pointer"
        onClick={() => setDevRewardsOpen(true)}
      >
        Learn more about Dev Rewards
      </a>
    ),
  },
  {
    title: 'Explore opportunities with external projects',
    imageSrc: '/images/build-page/explore-opportunities.jpg',
    description: (
      <>
        <p>
          Collaborate with external projects seeking skilled developers and
          discover opportunities that align with your expertise, with
          compensation handled directly by the third-party projects.
        </p>
        <h3 className="font-semibold mt-4">Browse opportunities</h3>
        <p>Discover a list of projects that match your skills. </p>
        <h3 className="font-semibold mt-4">Get in touch</h3>
        <p>Find projects that align with your expertise and interests.</p>
      </>
    ),
    link: (
      <Link
        href={'https://build.olas.network/opportunities'}
        className="text-purple-600"
        target="_blank"
      >
        Get matched with an opportunity ↗
      </Link>
    ),
  },
];

export const WaysToGrow = () => {
  const [isDevRewardsOpen, setDevRewardsOpen] = useState(false);

  return (
    <SectionWrapper
      backgroundType="NONE"
      customClasses="py-16 md:py-24 px-4"
      id="grow"
    >
      <h2 className="text-4xl lg:mb-6 xl:mb-8 font-extrabold my-6 lg:my-auto text-center">
        Two ways to grow and earn as an Olas Builder
      </h2>
      <p className="text-gray-600 text-center mb-12">
        Embark on one or both ways of building to maximize your impact and
        earnings in the Olas ecosystem.
      </p>

      <div className="grid md:grid-cols-2 gap-x-10 md:gap-x-6 gap-y-4 max-w-5xl mx-auto ">
        {ways.map((item) => (
          <Card
            className="flex flex-col overflow-hidden border-t rounded-xl border-white"
            key={item.title}
          >
            <Image
              src={item.imageSrc}
              alt={item.title}
              width={495}
              height={260}
              className="rounded-xl py-auto object-cover w-full"
            />
            <div className="p-6 py-8">
              <CardTitle className="mb-6 leading-[140%] text-center">
                <span>{item.title}</span>
              </CardTitle>
              <div className="mb-6 text-start">{item.description}</div>
              {item.showDevRewards && (
                <div>{item.showDevRewards(setDevRewardsOpen)}</div>
              )}
              {isDevRewardsOpen && (
                <>
                  <div className="fixed w-[100vw] h-[100vw] z-50 left-0 top-0 bg-black opacity-40"></div>
                  <Card
                    className="fixed z-50 w-2/3 h-2/3 m-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mx-auto overflow-hidden bg-white"
                    onClick={() => setDevRewardsOpen(false)}
                  >
                    <div className="py-10 flex flex-col h-full">
                      <a
                        className="absolute top-0 right-5 cursor-pointer p-5"
                        onClick={() => {
                          setDevRewardsOpen(false);
                        }}
                      >
                        <Cross2Icon />
                      </a>
                      <div className="overflow-auto flex-1">
                        <Content />
                      </div>
                    </div>
                  </Card>
                </>
              )}
              {item.link}
            </div>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  );
};
