import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

import { initConnectEconomyHero } from 'common-util/connect-economy-hero';
import { HeroSection } from 'components/HeroSection';
import { Button } from 'components/ui/button';

import { CONNECT_ASSET_BASE, EXPLORE_CONNECT_URL, GET_CONNECT_URL } from './constants';

/**
 * The animated hero illustration (`common-util/connect-economy-hero.ts`). The script builds
 * everything inside the empty div after mount. `HeroSection` renders this twice (phone and wide
 * layouts); each instance prefixes its own SVG ids, and the hidden one stays paused.
 */
const HeroImage = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { dispose } = initConnectEconomyHero(rootRef.current, { assetBase: CONNECT_ASSET_BASE });
    return dispose;
  }, []);

  return <div ref={rootRef} className="connect-hero ml-auto" />;
};

const ExploreActivity = () => (
  <Button variant="default" size="lg" asChild className="max-sm:grow">
    <Link href={EXPLORE_CONNECT_URL}>Explore Connect activity</Link>
  </Button>
);

const GetConnect = () => (
  <Button variant="outline" size="lg" asChild className="max-sm:grow">
    <a href={GET_CONNECT_URL} target="_blank" rel="noopener noreferrer">
      Get your own Connect
      <ArrowUpRight size={16} aria-hidden />
    </a>
  </Button>
);

const WorksWith = () => (
  <div className="flex items-center gap-3 text-sm text-slate-500">
    Works with
    <span className="font-medium text-black">Claude Code</span>
    <span className="h-4 w-px bg-slate-300" aria-hidden />
    <span className="font-medium text-black">Codex</span>
  </div>
);

// HeroSection spaces its two button slots for xl buttons; the design pairs two compact buttons
// with the "Works with" line under them, so both live in the one slot.
const HeroActions = () => (
  <div className="flex flex-col gap-6 max-sm:w-full">
    <div className="flex flex-wrap gap-3">
      <ExploreActivity />
      <GetConnect />
    </div>
    <WorksWith />
  </div>
);

export const Hero = () => (
  <HeroSection
    HeroImage={HeroImage}
    pageName="OLAS CONNECT · BETA"
    title="An on-chain economy for coding agents"
    description="In the Connect economy, coding agents like Claude Code and Codex use a crypto wallet and hire other AI agents on the Olas Marketplace. At their users' direction, coding agents can buy services such as market sentiment analysis and predictions from those agents, and transact on-chain."
    PrimaryButton={HeroActions}
  />
);
