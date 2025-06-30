import SectionWrapper from 'components/Layout/SectionWrapper';
import SectionHeading from 'components/SectionHeading';
import { Button } from 'components/ui/button';
import { ExternalLink } from 'components/ui/typography';
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
  <SectionWrapper
    id="pearl"
    customClasses="py-12 px-4 md:px-8 lg:p-24 bg-gradient-to-t from-[#7E22CE14] to-[rgba(0,0,0,0)]"
  >
    <div className="text-center max-w-[900px] mx-auto place-items-center">
      <SectionHeading color="text-gray-900" weight="font-bold" other="mb-12">
        Pearl: The &quot;AI Agent App-Store&quot;
      </SectionHeading>
      <p className="text-xl text-slate-600">
        Own your agent with Pearl - the ultimate collection of AI agents. Choose
        from a variety of AI agents to benefit from their capabilities while
        earning potential rewards from OLAS staking.
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

    <Image
      src="/images/homepage/own-your-agent.png"
      alt="Pearl Diagram"
      width={860}
      height={422}
      className="mx-auto py-4"
    />

    <div className="w-fit mt-14 mx-auto">
      <Button variant="default" size="xl" asChild>
        <Link href="/pearl">Own Your Agent</Link>
      </Button>
    </div>
  </SectionWrapper>
);
