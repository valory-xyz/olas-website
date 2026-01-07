import { PEARL_YOU_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import SectionHeading from 'components/SectionHeading';
import { Button } from 'components/ui/button';
import { ExternalLink, SubsiteLink } from 'components/ui/typography';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

const list = [
  {
    name: 'forbes',
    linkUrl:
      'https://www.forbes.com/sites/digital-assets/2025/02/06/three-ai-agents-built-on-blockchain-to-transform-crypto-defi-gaming/',
  },
  {
    name: 'the-block',
    linkUrl:
      'https://www.theblock.co/post/338713/olas-raises-13-8-million-to-launch-pearl-an-app-store-for-autonomous-ai-agents-in-crypto',
  },
];

export const OwnYourAgent = () => (
  <div className="relative bg-gradient-to-t from-[#E7EAF4] to-white">
    <div className="absolute inset-0 top-[60px] w-full flex justify-center">
      <Image
        src="/images/homepage/pearl-hero-bg.png"
        alt="hero bg"
        width={1512}
        height={620}
        className="mx-auto object-contain opacity-60"
      />
      <div
        className="
          absolute inset-0
          pointer-events-none
          bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0)_60%,rgba(255,255,255,1)_100%)]
        "
      />
    </div>
    <SectionWrapper
      id="pearl"
      customClasses="py-12 px-4 md:px-8 lg:p-24 relative"
      backgroundType="NONE"
    >
      <div className="text-center max-w-[900px] mx-auto place-items-center">
        <SectionHeading color="text-gray-900" weight="font-bold" other="mb-12">
          Pearl: The &quot;AI Agent App-Store&quot;
        </SectionHeading>
        <p className="text-xl text-slate-600">
          Own your agent with Pearl - the ultimate collection of AI agents.
          Choose from a variety of AI agents to benefit from their capabilities
          while earning potential rewards from OLAS staking.
        </p>
        <div className="text-lg text-slate-500 flex flex-row gap-4 my-10">
          <p>Featured in</p>
          {list.map((item) => (
            <ExternalLink key={item.name} href={item.linkUrl} hideArrow>
              <Image
                src={`/images/homepage/${item.name}.svg`}
                alt={item.name}
                width={60}
                height={19}
                className="w-auto"
              />
            </ExternalLink>
          ))}
        </div>
      </div>

      <div className="mx-auto w-fit">
        <Image
          src="/images/homepage/pearl.png"
          alt="Pearl v1"
          width={864}
          height={474}
          className="mx-auto"
        />
      </div>

      <div className="w-fit mt-14 mx-auto">
        // @ts-expect-error TS(2304) FIXME: Cannot find name 'children'.
        // @ts-expect-error TS(2322): Type '{ children: Element; variant: string; size: ... Remove this comment to see the full error message
        // @ts-expect-error TS(2322) FIXME: Type '{ children: any[]; variant: "default"; size:... Remove this comment to see the full error message
        <Button variant="default" size="xl" asChild>
          // @ts-expect-error TS(2304) FIXME: Cannot find name 'childre'.
          // @ts-expect-error TS(2741): Property 'className' is missing in type '{ childre... Remove this comment to see the full error message
          <SubsiteLink href={PEARL_YOU_URL} isInButton isExternal>
            Own Your Agent
            <ArrowUpRight size={24} className="ml-2" />
          </SubsiteLink>
        </Button>
      </div>
    </SectionWrapper>
  </div>
);
