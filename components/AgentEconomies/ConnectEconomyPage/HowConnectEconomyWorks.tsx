import { useEffect, useRef } from 'react';

import { SECTION_BOX_CLASS, SECTION_H2_CLASS } from 'common-util/classes';
import { initConnectHowItWorks } from 'common-util/connect-how-it-works';
import SectionWrapper from 'components/Layout/SectionWrapper';

import { CONNECT_ASSET_BASE } from './constants';

/**
 * The animated "How Connect works" diagram (`common-util/connect-how-it-works.ts`). The script
 * builds everything inside the empty SVG after mount and is torn down on unmount. Single instance
 * per page — its SVG ids are fixed (`hiw-*`).
 */
export const HowConnectEconomyWorks = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const { dispose } = initConnectHowItWorks(svgRef.current, { assetBase: CONNECT_ASSET_BASE });
    return dispose;
  }, []);

  return (
    <SectionWrapper
      customClasses={`${SECTION_BOX_CLASS} pt-[80px] pb-[120px] border-t`}
      id="how-it-works"
    >
      <div className="max-w-[1096px] mx-auto flex flex-col gap-10">
        <div className="text-center flex flex-col gap-4">
          <h2 className={SECTION_H2_CLASS}>How Connect works</h2>
          <p className="text-lg leading-6 text-slate-600">
            Three parts work together: coding agents can reason, Connect gives them crypto wallets,
            and the Olas Marketplace lets them hire other AI agents.
          </p>
        </div>
        <div className="rounded-2xl bg-[#F3F5F9]">
          <svg
            ref={svgRef}
            viewBox="0 0 1120 680"
            role="img"
            aria-label="Your coding agent runs Connect agents on Gnosis, Polygon and Robinhood Chain; each agent requests AI services on the Olas Marketplace and acts on its chain. Many people's agents share the same Marketplace and chains."
            className="block w-full h-auto font-sans transition-opacity duration-[180ms]"
          />
        </div>
      </div>
    </SectionWrapper>
  );
};
