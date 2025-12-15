import { MECH_MARKETPLACE_URL, PEARL_YOU_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import SectionHeading from 'components/SectionHeading';
import { ExternalLink, Link, SubsiteLink } from 'components/ui/typography';
import Image from 'next/image';

export const OlasAgents = () => (
  <div>
    <Image
      src="/images/agents/olas-agent.png"
      alt="Olas AI Agents"
      width={157}
      height={157}
      className="mx-auto"
    />
    <p className="-top-[40px] relative text-center">Olas AI Agent</p>
  </div>
);

export const WhatMakesOlasAgentsUnique = () => (
  <SectionWrapper>
    <div className="flex flex-col max-w-[1320px] mx-auto text-center">
      <SectionHeading>What Makes Olas&apos; AI Agents Unique?</SectionHeading>
      <p className="mb-10">
        Olas agents are autonomous AI agents that satisfy these additional
        characteristics:
      </p>
      <div className="text-left mx-auto relative">
        <div className="max-md:hidden">
          <div className="agents-bg" />
        </div>
        <div className="flex flex-col md:flex-row gap-4 lg:gap-14 md:pt-14 relative z-10">
          <div className="md:hidden relative my-10 z-10">
            <Image
              src="/images/agents/mobile-circles.png"
              alt="bg"
              width={385}
              height={385}
              className="absolute mx-auto -top-16 z-0"
            />

            <div className="relative z-10">
              <OlasAgents />
            </div>
          </div>
          <div className="flex flex-col justify-between max-w-[267px]">
            <div>
              <Image
                src="/images/agents/safe.png"
                alt="Safe"
                width={267}
                height={198}
              />
              <p className="-top-[35px] relative">
                They self-custody resources via a wallet. Olas agents use
                account abstraction (via{' '}
                <ExternalLink href="https://safe.global/">Safe</ExternalLink>).
              </p>
            </div>
            <div>
              <Image
                src="/images/agents/poaa.png"
                alt="PoAA"
                width={267}
                height={112}
              />
              <p className="-top-[30px] relative">
                They optionally earn rewards via{' '}
                <Link href="/staking">Olas Staking</Link>.
              </p>
            </div>
          </div>
          <div className="content-center max-md:hidden">
            <OlasAgents />
          </div>
          <div className="flex flex-col justify-between max-w-[267px]">
            <div>
              <Image
                src="/images/agents/registry.png"
                alt="Registry"
                width={267}
                height={276}
              />
              <p className="-top-[35px] relative">
                They are listed on a global agent directory called{' '}
                <SubsiteLink href={MECH_MARKETPLACE_URL}>
                  Mech Marketplace
                </SubsiteLink>
                .
              </p>
            </div>
            <div>
              <Image
                src="/images/agents/pearl.png"
                alt="Pearl"
                width={267}
                height={300}
              />
              <p className="-top-[30px] relative">
                They optionally are made accessible to end-users via{' '}
                <SubsiteLink href={PEARL_YOU_URL}>
                  Pearl, the AI Agent App Store
                </SubsiteLink>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </SectionWrapper>
);
