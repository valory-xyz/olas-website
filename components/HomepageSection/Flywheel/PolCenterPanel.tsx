import { cn } from 'lib/utils';
import Image from 'next/image';
import { useCallback, useState } from 'react';

import { ChainPill } from './ChainPill';
import { CHAIN_PILLS, ProtocolActivityMetrics } from './constants';

type PolCenterPanelProps = {
  protocolMetrics?: ProtocolActivityMetrics;
};

export const PolCenterPanel = ({ protocolMetrics }: PolCenterPanelProps) => {
  // Pill tooltips render in a portal, so hovering their content drops the
  // panel's CSS :hover — keep the section raised while any tooltip is open.
  const [openTooltips, setOpenTooltips] = useState(0);
  const handleTooltipOpenChange = useCallback((open: boolean) => {
    setOpenTooltips((count) => Math.max(0, count + (open ? 1 : -1)));
  }, []);
  const raised = openTooltips > 0;

  return (
    <div
      className="group relative w-full h-full rounded-2xl"
      style={{
        border: '1px solid rgba(156, 176, 201, 0.4)',
        backgroundImage: 'url(/images/homepage/dot-pattern.png)',
      }}
    >
      {/* top offset centers the hexagon IMAGE (not image+caption) on the panel's
        vertical middle, so it lines up with the side cards and mid pill row. */}
      <div
        className={cn(
          'absolute left-1/2 top-[110px] -translate-x-1/2 z-10 group-hover:z-30 flex flex-col items-center gap-1',
          raised && 'z-30'
        )}
      >
        <Image src="/images/homepage/olas-token.png" alt="OLAS token" width={130} height={119} />
        <p className="text-sm text-slate-600 w-[130px] text-center">
          Protocol-owned Liquidity (PoL)
        </p>
      </div>
      {CHAIN_PILLS.map(({ key, label, icon, style }) => (
        <ChainPill
          key={key}
          label={label}
          icon={icon}
          style={style}
          metric={protocolMetrics?.polByChain?.[key]}
          raised={raised}
          onTooltipOpenChange={handleTooltipOpenChange}
        />
      ))}
      {/* Tint sits ABOVE the pills and hexagon, muting them until the section is
        hovered — then they rise over it (group-hover:z-30) and read normally. */}
      <div
        className="absolute inset-0 z-20 rounded-2xl pointer-events-none"
        style={{ background: 'rgba(156, 176, 201, 0.15)' }}
      />
    </div>
  );
};
