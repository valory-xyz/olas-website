import type { PolChainValue } from 'common-util/api/other-metrics/protocol';
import { isFrozen } from 'common-util/graphql/metric-utils';
import type { MetricWithStatus } from 'common-util/graphql/types';
import { formatUsd } from 'common-util/numberFormatter';
import { Card } from 'components/ui/card';
import { Popover } from 'components/ui/popover';
import { StaleMetricContent } from 'components/ui/StaleIndicator';
import { cn } from 'lib/utils';
import Image from 'next/image';
import { Fragment } from 'react';
import type { CSSProperties } from 'react';
import { formatTokenAmount } from 'common-util/numberFormatter';

import { TOKEN_ICONS } from './constants';

type ChainPillProps = {
  label: string;
  icon: string;
  style: CSSProperties;
  metric?: MetricWithStatus<PolChainValue | null>;
  // Keeps the panel raised while this pill's (portaled) tooltip is open.
  raised?: boolean;
  onTooltipOpenChange?: (open: boolean) => void;
};

// The pill card itself, shared by the desktop panel and the mobile grid.
export const ChainPillCard = ({
  label,
  icon,
  metric,
  className,
  onTooltipOpenChange,
}: Omit<ChainPillProps, 'style' | 'raised'> & { className?: string }) => {
  const value = metric?.value;
  const tokens = value?.tokens ?? [];

  return (
    <Card
      className={cn(
        'activity-card-opaque flex flex-row items-center gap-2 rounded-lg px-3 py-1.5',
        className
      )}
    >
      <Image src={icon} alt={label} width={20} height={20} />
      <span
        className={cn(
          'font-semibold',
          isFrozen(metric?.status) ? 'text-gray-400' : 'text-purple-700'
        )}
      >
        {formatUsd(value?.usd)}
      </span>
      <Popover
        contentClassName="max-w-[360px] text-left font-normal"
        onOpenChange={onTooltipOpenChange}
      >
        <strong>Protocol-owned liquidity on {label}</strong>
        {tokens.length > 0 && (
          <div className="mt-2 flex flex-row flex-wrap items-center gap-2">
            {tokens.map(({ symbol, amount }, i) => (
              <Fragment key={symbol}>
                {i > 0 && <span className="text-slate-400">:</span>}
                {TOKEN_ICONS[symbol] && (
                  <Image src={TOKEN_ICONS[symbol]} alt={symbol} width={18} height={18} />
                )}
                <span className="whitespace-nowrap">
                  {formatTokenAmount(amount)} {symbol}
                </span>
              </Fragment>
            ))}
          </div>
        )}
        {metric?.status?.stale && (
          <div className="mt-4">
            <StaleMetricContent status={metric.status} />
          </div>
        )}
      </Popover>
    </Card>
  );
};

export const ChainPill = ({
  label,
  icon,
  style,
  metric,
  raised,
  onTooltipOpenChange,
}: ChainPillProps) => (
  // Positioning lives on the wrapper: .activity-card-opaque forces
  // `position: relative` on the Card, which would override `absolute`.
  <div className={cn('absolute z-10 group-hover:z-30', raised && 'z-30')} style={style}>
    <ChainPillCard
      label={label}
      icon={icon}
      metric={metric}
      onTooltipOpenChange={onTooltipOpenChange}
    />
  </div>
);
