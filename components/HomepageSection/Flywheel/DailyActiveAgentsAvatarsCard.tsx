import type { MetricStatus } from 'common-util/graphql/types';
import { Card } from 'components/ui/card';
import { Popover } from 'components/ui/popover';
import { StaleMetricContent } from 'components/ui/StaleIndicator';
import { Link } from 'components/ui/typography';
import Image from 'next/image';

import { ActivityValue } from '../ActivityCards';
import { DAA_AVATARS, TOOLTIPS } from './constants';

type DailyActiveAgentsAvatarsCardProps = {
  dailyActiveAgents?: string;
  dailyActiveAgentsStatus?: MetricStatus;
};

export const DailyActiveAgentsAvatarsCard = ({
  dailyActiveAgents,
  dailyActiveAgentsStatus,
}: DailyActiveAgentsAvatarsCardProps) => (
  <Card className="activity-card-opaque flex flex-col gap-3 px-5 py-4 w-[290px] text-left">
    <div className="flex flex-row gap-1.5">
      {DAA_AVATARS.map((src) => (
        <Image
          key={src}
          src={src}
          alt=""
          aria-hidden
          width={40}
          height={40}
          className="rounded-lg border border-slate-200"
        />
      ))}
    </div>
    <ActivityValue
      LinkComponent={Link}
      href="/data#daily-active-agents"
      value={dailyActiveAgents}
      status={dailyActiveAgentsStatus}
      textSize="2xl"
      text={
        <>
          <span className="whitespace-nowrap">Daily Active Agents</span>{' '}
          <Popover contentClassName="max-w-[300px] text-left font-normal">
            {TOOLTIPS.dailyActiveAgents}
            {dailyActiveAgentsStatus?.stale && (
              <div className="mt-4">
                <StaleMetricContent status={dailyActiveAgentsStatus} />
              </div>
            )}
          </Popover>
        </>
      }
    />
  </Card>
);
