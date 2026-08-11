import { BUILD_URL, STACK_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card, CardTitle } from 'components/ui/card';
import { SubsiteLink } from 'components/ui/typography';
import Image from 'next/image';
import Link from 'next/link';
// `Content` (the Dev Rewards explainer modal) is intentionally left in the repo
// unimported: the programme is paused, not cancelled, so restoring the modal is
// a matter of re-adding a `showDevRewards` entry to the card below.

const ways = [
  {
    title: 'Hire an Agent on Marketplace',
    imageSrc: '/images/build-page/hire.png',
    description: <>Make use of the available mechs on Mech Marketplace.</>,
    link: (
      <SubsiteLink href={`${BUILD_URL}/hire`} className="mt-4">
        Hire an agent
      </SubsiteLink>
    ),
  },
  {
    title: "Offer your agent's services on Marketplace",
    imageSrc: '/images/build-page/offer.png',
    description: (
      <>
        <p>Try your hand at making your own AI Agent. You can either:</p>
        <ul className="list-disc ml-6 mt-4">
          <li>
            Build tools using the{' '}
            <SubsiteLink href={`${STACK_URL}/mech-tools-dev`}>Mech Tools Dev</SubsiteLink>
          </li>
          <li>
            Or build you agent with whatever framework you want, wrap it in{' '}
            <SubsiteLink href={`${STACK_URL}/olas-sdk`}>Olas SDK</SubsiteLink>
          </li>
        </ul>
        <p className="mt-4">And then register on Marketplace.</p>
      </>
    ),
    link: (
      <Link href={`${BUILD_URL}/monetize`} className="text-purple-600 mt-auto">
        Monetize your agent
      </Link>
    ),
  },
  {
    title: 'Build an Agent for Pearl in Accelerator',
    imageSrc: '/images/build-page/accelerator-program.png',
    description: (
      <>
        <p>
          Apply for the $1million grants program to build AI Agents for Pearl: The &quot;AI Agent
          App Store&quot;.
        </p>
        <h3 className="font-semibold mt-4">Get funded</h3>
        <p>Up to $100K in grants to build, launch, and scale your AI agent.</p>
        <h3 className="font-semibold mt-4">Earn rewards</h3>
        <p>Have a chance to receive ongoing OLAS Dev Rewards for your registered agents.</p>
        <h3 className="font-semibold mt-4">Access support</h3>
        <p>Leverage technical resources, developer workshops, and marketing support to succeed.</p>
      </>
    ),
    link: (
      <Link href="/accelerator" className="text-purple-600 mt-auto">
        Learn more & apply
      </Link>
    ),
  },
  {
    title: 'Contribute code to the Olas Protocol',
    imageSrc: '/images/build-page/earn-dev-rewards.png',
    description: (
      <>
        <p className="mb-4">
          Contribute valuable code units — like agents or components — to the Olas protocol, where
          they can be reused across the ecosystem.
        </p>
        <p className="mb-4">
          Dev Rewards is the part of the protocol that facilitates the distribution of capital to
          developers who contribute to various services in the ecosystem, rewarding both code
          components and entire agents.
        </p>
        <p className="font-semibold">
          The Dev Rewards program is currently paused and is not accepting new claims.
        </p>
      </>
    ),
  },
];

export const WaysToGrow = () => {
  return (
    <SectionWrapper backgroundType="NONE" customClasses="py-16 md:py-24 px-4" id="why-build">
      <h2 className="text-4xl lg:mb-6 xl:mb-8 font-extrabold my-6 lg:my-auto text-center">
        Four ways to grow and earn as an Olas Builder
      </h2>
      <p className="text-gray-600 text-center mb-12">
        Embark on ways of building to maximize your impact and earnings in the Olas ecosystem.
      </p>

      <div className="grid md:grid-cols-2 gap-x-10 md:gap-x-6 gap-y-4 max-w-4xl mx-auto">
        {ways.map((item) => (
          <Card className="flex flex-col overflow-hidden border rounded-xl" key={item.title}>
            <Image
              src={item.imageSrc}
              alt={item.title}
              width={495}
              height={260}
              className="rounded-xl py-auto object-cover w-full"
            />
            <div className="p-6 py-8 flex flex-col h-full">
              <CardTitle className="mb-6 leading-[140%] text-xl text-center">
                <span>{item.title}</span>
              </CardTitle>
              <div className="mb-6 text-start">{item.description}</div>
              <div className="mt-auto">{item.link}</div>
            </div>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  );
};
