import { Popover } from 'components/ui/popover';
import Image from 'next/image';

import { ChainPillCard } from './ChainPill';
import { CHAIN_PILLS, FEE_SWITCHES, ProtocolActivityMetrics, TOOLTIPS } from './constants';
import { FeesFromPolCard } from './FeesFromPolCard';

// Grid order follows the mobile design (roughly by PoL size).
const MOBILE_CHAIN_ORDER = [
  'ethereum',
  'gnosis',
  'base',
  'arbitrum',
  'solana',
  'polygon',
  'optimism',
  'celo',
] as const;

// Small self-contained down arrow reusing the design arrowhead. The desktop
// SVG's markers live in a display:none subtree on mobile, so define our own.
const DownArrow = () => (
  <svg width="22" height="48" viewBox="0 0 22 48" className="mx-auto" aria-hidden>
    <defs>
      <marker
        id="fw-arrow-mobile"
        viewBox="0 0 17 19"
        refX="16.4"
        refY="9.15"
        markerWidth="6.3"
        markerHeight="7"
        orient="auto-start-reverse"
      >
        <path
          d="M2.35766 0.661107L15.7145 7.99964C16.5753 8.47255 16.5795 9.70774 15.7221 10.1866L2.37386 17.6404C1.36048 18.2063 0.190138 17.2057 0.591564 16.1167L3.02183 9.52353C3.12578 9.24153 3.12464 8.93151 3.01862 8.65028L0.586099 2.19757C0.176576 1.11124 1.34016 0.102072 2.35766 0.661107Z"
          fill="#94a3b8"
          stroke="#94a3b8"
        />
      </marker>
    </defs>
    <path d="M 11 0 V 44" stroke="#94a3b8" strokeWidth={3} markerEnd="url(#fw-arrow-mobile)" />
  </svg>
);

type PolMobileSectionProps = {
  protocolMetrics?: ProtocolActivityMetrics;
};

export const PolMobileSection = ({ protocolMetrics }: PolMobileSectionProps) => (
  <div className="flex flex-col">
    <div
      className="rounded-2xl p-4"
      style={{
        border: '1px solid rgba(156, 176, 201, 0.4)',
        background: 'rgba(156, 176, 201, 0.15) url(/images/homepage/dot-pattern.png)',
      }}
    >
      <Image
        src="/images/homepage/olas-token.png"
        alt="OLAS token"
        width={150}
        height={137}
        className="mx-auto"
      />
      <p className="text-base font-medium text-slate-600 text-center mt-2 mb-4">
        Protocol-owned Liquidity (PoL)
      </p>
      <div className="grid grid-cols-2 gap-2">
        {MOBILE_CHAIN_ORDER.map((key) => {
          const pill = CHAIN_PILLS.find((p) => p.key === key);
          if (!pill) return null;
          return (
            <ChainPillCard
              key={key}
              label={pill.label}
              icon={pill.icon}
              metric={protocolMetrics?.polByChain?.[key]}
            />
          );
        })}
      </div>
    </div>

    <div className="my-3">
      <DownArrow />
    </div>

    <FeesFromPolCard protocolMetrics={protocolMetrics} className="w-full" />

    {/* Vertical drop from the fees card, then the OFF valve sitting on a short
        line (knob centered under the drop), with its label to the right. */}
    <div className="flex flex-col items-center">
      <div className="h-7 w-[3px] bg-[#94a3b8]" />
      <div className="relative h-[42px] w-[180px]">
        <div className="absolute left-[34px] top-[9px] w-[56px] h-[3px] bg-[#94a3b8]" />
        <Image
          src="/images/homepage/activity/fee-switch-off.png"
          alt="Fee switch off"
          width={22}
          height={45}
          className="absolute left-[79px] top-[-24px]"
        />
        <div className="absolute left-[108px] top-0 flex flex-row gap-[2px] text-xs font-bold leading-5 text-black">
          <p>{FEE_SWITCHES.pol}</p>
          <Popover
            align="center"
            side="bottom"
            iconSize={16}
            contentClassName="w-[320px] text-left font-normal"
          >
            {TOOLTIPS.polFeeSwitch}
          </Popover>
        </div>
      </div>
      <p className="text-base font-normal text-[#606F85] mt-2">OLAS is burned when switch is ON</p>
    </div>
  </div>
);
