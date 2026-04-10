import { PEARL_YOU_URL_WITH_UTM_SOURCE } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import SectionHeading from 'components/SectionHeading';
import { Button } from 'components/ui/button';
import { ExternalLink, SubsiteLink } from 'components/ui/typography';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

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
          Pearl: The &quot;Agent App-Store&quot;
        </SectionHeading>
        <p className="text-xl text-slate-600">
          The home of agents you actually own. Uniquely, you control of your funds whilst your agents work on everything from predicting the future to managing your portfolio. All while earning potential Olas staking rewards.
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
          src="/images/homepage/pearl-screenshot.png"
          alt="Pearl"
          width={864}
          height={474}
          className="mx-auto"
        />
      </div>

      <div className="w-fit mt-14 mx-auto gap-4 flex max-md:flex-col">
        <Button variant="default" size="lg" asChild>
          <SubsiteLink
            href={`${PEARL_YOU_URL_WITH_UTM_SOURCE}&utm_campaign=homepage&utm_content=own-your-agent-button`}
            isInButton
            isExternal
          >
            Own Your Agent
            <ArrowUpRight size={20} className="ml-2" />
          </SubsiteLink>
        </Button>

        <Button variant="outline" size="lg" asChild>
          <Link
            href='/agents'
          >
            Explore Agents
          </Link>
        </Button>
      </div>
    </SectionWrapper>
  </div>
);
