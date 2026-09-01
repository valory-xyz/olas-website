import { formatUsd } from 'common-util/numberFormatter';
import { Card } from 'components/ui/card';
import { Popover } from 'components/ui/popover';
import { StaleMetricContent } from 'components/ui/StaleIndicator';
import { Link } from 'components/ui/typography';
import { cn } from 'lib/utils';
import Image from 'next/image';

import { ActivityValue } from '../ActivityCards';
import { ProtocolActivityMetrics } from './constants';

type FeesFromPolCardProps = {
  protocolMetrics?: ProtocolActivityMetrics;
  className?: string;
};

export const FeesFromPolCard = ({ protocolMetrics, className }: FeesFromPolCardProps) => {
  const revenue = protocolMetrics?.totalProtocolRevenue;

  return (
    <Card
      className={cn(
        'activity-card-opaque flex flex-col gap-3 px-5 py-4 w-[280px] text-left',
        className
      )}
    >
      <div className="flex flex-row place-items-center gap-3">
        <Image src="/images/homepage/activity/pol-fees.png" alt="Fees" width={40} height={40} />
        <span className="whitespace-nowrap">Fees collected from PoL</span>
      </div>
      <ActivityValue
        LinkComponent={Link}
        href="/data#protocol-liquidity-fees"
        value={formatUsd(revenue?.value)}
        status={revenue?.status}
        textSize="2xl"
        text={
          <Popover omitSrText contentClassName="max-w-[400px] text-left font-normal">
            <strong>Fees collected from PoL across all chains</strong>
            <p className="mt-2">
              This total adds up what each fee was worth when the protocol collected it.
            </p>
            <p className="mt-2">
              Since fees accrue in the liquidity pools, their dollar value changes continuously and
              might now be higher or lower than when collected.
            </p>
            {revenue?.status?.stale && (
              <div className="mt-4">
                <StaleMetricContent status={revenue.status} />
              </div>
            )}
          </Popover>
        }
      />
    </Card>
  );
};
