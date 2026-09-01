import { VALORY_GIT_URL } from 'common-util/constants';
import { isFrozen } from 'common-util/graphql/metric-utils';
import { MetricStatus } from 'common-util/graphql/types';
import { formatEthNumber, formatUsd } from 'common-util/numberFormatter';
import { Card } from 'components/ui/card';
import { Popover } from 'components/ui/popover';
import { StaleIndicator, StaleMetricContent } from 'components/ui/StaleIndicator';
import { ExternalLink, Link } from 'components/ui/typography';
import { cn } from 'lib/utils';
import Image from 'next/image';

import { formatTokenAmount } from './Flywheel/ChainPill';
import { MARKETPLACE_FEE_TOKENS, TOKEN_ICONS } from './Flywheel/constants';

const imgPath = '/images/homepage/activity/';

const agents = ['predict', 'babydegen', 'mech', 'agentsfun'];

type ActivityValueProps = {
  LinkComponent: React.ComponentType<{
    href: string;
    children: React.ReactNode;
  }>;
  href: string;
  value: string | number;
  text?: React.ReactNode;
  status?: MetricStatus;
  textSize?: 'xl' | '2xl';
  valueClassName?: string;
};

type OlasIsBurnedArrowProps = {
  pointsDown?: boolean;
  className?: string;
};

type UsersCardProps = {
  olasStaked?: string;
  totalOperators?: string;
  totalOperatorsStatus?: MetricStatus;
  olasStakedStatus?: MetricStatus;
};

type DailyActiveAgentsCardProps = {
  dailyActiveAgents?: string;
  dailyActiveAgentsStatus?: MetricStatus;
};

type AgentToAgentCardProps = {
  ataTransactions?: string;
  mechFees?: string | number;
  feesCollected?: string | number;
  feesCollectedByToken?: Record<string, number> | null;
  ataTransactionsStatus?: MetricStatus;
  mechFeesStatus?: MetricStatus;
  feesCollectedStatus?: MetricStatus;
};

type TransactionsCardProps = {
  transactions?: string;
  transactionsStatus?: MetricStatus;
};

export const ActivityValue = ({
  LinkComponent,
  href,
  value,
  text,
  status,
  textSize = 'xl',
  valueClassName,
}: ActivityValueProps) => (
  <div className="flex flex-row gap-2 place-items-center">
    <LinkComponent href={href}>
      <div
        className={cn(
          textSize === '2xl' ? 'text-2xl' : 'text-xl',
          'font-semibold',
          // Frozen grey wins over any custom value class — a value that stopped
          // updating must never render as live.
          isFrozen(status) ? 'text-gray-400' : (valueClassName ?? 'text-purple-700')
        )}
      >
        {value}
      </div>
    </LinkComponent>
    {text}
  </div>
);

export const OlasIsBurnedArrow = ({
  pointsDown = false,
  className = '',
}: OlasIsBurnedArrowProps) => (
  <div className={`flex flex-row md:mt-4 gap-2 ${className}`}>
    <p className="w-[82px] md:ml-[28px] text-sm mt-9 md:mt-[46px] mb-auto max-sm:text-slate-500">
      OLAS is burned
    </p>
    <Image
      src={`${imgPath}${pointsDown ? 'mobile-arrow4.png' : 'arrow4.png'}`}
      alt="arrow"
      width={28}
      height={124}
      className="h-[124px]"
    />
    <div className="mb-auto mt-[47px] w-[76px] font-semibold text-sm md:mt-[58px] text-black z-20 content-center flex flex-row gap-2">
      <p>ON</p>
      <Popover
        omitSrText
        align="center"
        side="right"
        contentClassName="w-[382px] text-left font-normal translate-x-2"
      >
        <strong>Fees collected</strong> can be turned on or off by the Governors of the Olas
        Protocol. Currently, fees are turned on; they are designed to buy back and burn OLAS as the
        marketplace is used.
        <ExternalLink
          href={`${VALORY_GIT_URL}/autonolas-aip/blob/main/content/aips/aip-5/automate_relayer_marketplace.md`}
          className="mt-2 cursor-pointer"
        >
          More about Mech Marketplace fees in AIP-5
        </ExternalLink>
      </Popover>
    </div>
  </div>
);

type ActivityCardLinkProps = {
  text?: React.ReactNode;
  link: string;
  value: string | number;
  isLinkExternal?: boolean;
  status?: MetricStatus;
  valueClassName?: string;
};

type ActivityCardProps = {
  icon: string;
  iconWidth?: number;
  iconHeight?: number;
  alt?: string;
  text?: React.ReactNode;
  cardClassName?: string;
  primary: ActivityCardLinkProps;
  secondary?: Partial<ActivityCardLinkProps>;
  tertiary?: Partial<ActivityCardLinkProps>;
};

export const ActivityCard = ({
  icon,
  iconWidth = 40,
  iconHeight = 40,
  alt,
  text,
  cardClassName,
  primary: {
    text: primaryText,
    link: primaryLink,
    value: primaryValue,
    status: primaryStatus,
    isLinkExternal: primaryIsLinkExternal = true,
    valueClassName: primaryValueClassName,
  },
  secondary = {},
  tertiary = {},
}: ActivityCardProps) => {
  const {
    text: secondaryText,
    link: secondaryLink,
    value: secondaryValue,
    isLinkExternal: secondaryIsLinkExternal = true,
    status: secondaryStatus,
  } = secondary;

  const {
    text: tertiaryText,
    link: tertiaryLink,
    value: tertiaryValue,
    isLinkExternal: tertiaryIsLinkExternal = true,
    status: tertiaryStatus,
  } = tertiary;

  const PrimaryLink = primaryIsLinkExternal ? ExternalLink : Link;
  const SecondaryLink = secondaryIsLinkExternal ? ExternalLink : Link;
  const TertiaryLink = tertiaryIsLinkExternal ? ExternalLink : Link;

  return (
    <Card
      className={cn(
        'flex flex-col py-4 px-6 gap-4 h-fit w-full md:w-[300px] activity-card-opaque',
        cardClassName
      )}
    >
      <div className="flex flex-row place-items-center gap-3">
        <Image
          src={`${imgPath}${icon}`}
          alt={alt ?? (typeof text === 'string' ? text : 'Activity icon')}
          width={iconWidth}
          height={iconHeight}
        />
        {text}
      </div>
      <ActivityValue
        LinkComponent={PrimaryLink}
        href={primaryLink}
        value={primaryValue}
        text={primaryText}
        status={primaryStatus}
        textSize="2xl"
        valueClassName={primaryValueClassName}
      />
      {secondaryValue && (
        <ActivityValue
          LinkComponent={SecondaryLink}
          href={secondaryLink}
          value={secondaryValue}
          text={secondaryText}
          status={secondaryStatus}
          textSize="xl"
        />
      )}
      {tertiaryValue && (
        <ActivityValue
          LinkComponent={TertiaryLink}
          href={tertiaryLink}
          value={tertiaryValue}
          text={tertiaryText}
          status={tertiaryStatus}
          textSize="xl"
        />
      )}
    </Card>
  );
};

export const UsersCard = ({
  olasStaked,
  totalOperators,
  totalOperatorsStatus,
  olasStakedStatus,
}: UsersCardProps) => (
  <ActivityCard
    icon="users.png"
    text="Users"
    cardClassName="md:w-[360px]"
    primary={{
      value: totalOperators,
      text: (
        <>
          Agents deployed
          <StaleIndicator status={totalOperatorsStatus} />
        </>
      ),
      link: '/data#operators',
      status: totalOperatorsStatus,
      isLinkExternal: false,
    }}
    secondary={{
      value: olasStaked,
      text: (
        <>
          <span className="whitespace-nowrap">OLAS currently staked</span>
          <StaleIndicator status={olasStakedStatus} />
        </>
      ),
      link: '/data#olas-staked',
      status: olasStakedStatus,
      isLinkExternal: false,
    }}
  />
);

export const OlasBurnedCard = () => (
  <ActivityCard
    icon="olas-burned.png"
    alt="OLAS burned"
    primary={{
      value: '$0',
      text: 'of OLAS burned',
      link: '/data#protocol-fees',
      isLinkExternal: false,
    }}
  />
);

export const DailyActiveAgentsCard = ({
  dailyActiveAgents,
  dailyActiveAgentsStatus,
}: DailyActiveAgentsCardProps) => (
  <ActivityCard
    icon="daas.png"
    alt="Daily Active Agents"
    iconWidth={252}
    iconHeight={56}
    primary={{
      value: dailyActiveAgents,
      status: dailyActiveAgentsStatus,
      text: (
        <>
          Daily Active Agents{' '}
          <Popover omitSrText>
            7-day average Daily Active Agents
            {dailyActiveAgentsStatus?.stale && (
              <div className="mt-4">
                <StaleMetricContent status={dailyActiveAgentsStatus} />
              </div>
            )}
          </Popover>
        </>
      ),
      link: '/data#daily-active-agents',
      isLinkExternal: false,
    }}
  />
);

export const AgentToAgentCard = ({
  ataTransactions,
  mechFees,
  feesCollected,
  feesCollectedByToken,
  ataTransactionsStatus,
  mechFeesStatus,
  feesCollectedStatus,
}: AgentToAgentCardProps) => (
  <ActivityCard
    icon="agent-to-agent.png"
    alt="Agent to Agent"
    iconWidth={104}
    iconHeight={36}
    primary={{
      value: formatEthNumber(ataTransactions, { notation: 'standard' }),
      text: (
        <>
          A2A txns
          <StaleIndicator status={ataTransactionsStatus} />
        </>
      ),
      link: '/data#ata-transactions',
      status: ataTransactionsStatus,
      isLinkExternal: false,
    }}
    secondary={{
      value: formatUsd(mechFees),
      text: (
        <>
          turnover
          <StaleIndicator status={mechFeesStatus} />
        </>
      ),
      link: '/data#mech-turnover',
      status: mechFeesStatus,
      isLinkExternal: false,
    }}
    tertiary={{
      value: formatUsd(feesCollected, 2),
      text: (
        <>
          fees collected
          <StaleIndicator status={feesCollectedStatus} />
          <Popover omitSrText contentClassName="max-w-[400px] text-left font-normal">
            A 15% fee is taken on payments between AI agents on the Olas Marketplace.
            {MARKETPLACE_FEE_TOKENS.some(
              ({ symbol }) => feesCollectedByToken?.[symbol] != null
            ) && (
              <div className="mt-3 flex flex-col divide-y">
                {MARKETPLACE_FEE_TOKENS.map(({ symbol, chainIcons }) =>
                  feesCollectedByToken?.[symbol] == null ? null : (
                    <div key={symbol} className="flex flex-row items-center gap-2 py-2">
                      {TOKEN_ICONS[symbol] && (
                        <Image src={TOKEN_ICONS[symbol]} alt={symbol} width={18} height={18} />
                      )}
                      <span className="whitespace-nowrap">
                        {formatTokenAmount(feesCollectedByToken[symbol], 2)} {symbol}
                      </span>
                      <span className="ml-auto flex flex-row gap-1.5">
                        {chainIcons.map((chainIcon) => (
                          <Image key={chainIcon} src={chainIcon} alt="" width={16} height={16} />
                        ))}
                      </span>
                    </div>
                  )
                )}
              </div>
            )}
          </Popover>
        </>
      ),
      link: '/data#protocol-fees',
      status: feesCollectedStatus,
      isLinkExternal: false,
    }}
  />
);

export const TransactionsCard = ({ transactions, transactionsStatus }: TransactionsCardProps) => (
  <ActivityCard
    icon="txns.png"
    alt="Transactions"
    primary={{
      value: transactions,
      text: (
        <>
          txns
          <StaleIndicator status={transactionsStatus} />
        </>
      ),
      link: '/data#transactions',
      status: transactionsStatus,
      isLinkExternal: false,
    }}
  />
);

// Tile backgrounds match the desktop economy pill gradients — the icons no
// longer carry their own.
const AGENT_TILE_GRADIENTS: Record<string, string> = {
  predict: 'linear-gradient(119.14deg, #E4E9FB 0%, #FAE4FB 100.04%)',
  babydegen: 'linear-gradient(119.14deg, #E4E9FB 0%, #FAE4FB 100.04%)',
  mech: 'linear-gradient(119.14deg, #D4F2F1 0%, #DCF4EE 100.04%)',
  agentsfun: 'linear-gradient(119.14deg, #FBEAD0 0%, #E0EBEB 49.54%, #C7E1FF 100.04%)',
};

export const AgentsGrid = () => (
  <div className="grid grid-cols-2 gap-3 mb-4">
    {agents.map((item) => (
      <Link key={item} href={`/agent-economies/${item}`}>
        <div
          className="w-[132px] h-[116px] rounded-2xl grid place-items-center hover:-translate-y-1 duration-150"
          style={{
            background: AGENT_TILE_GRADIENTS[item],
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0px 8.78px 26.33px 0px rgba(24, 39, 75, 0.12)',
          }}
        >
          <Image
            src={`/images/homepage/activity/${item}.png`}
            alt={item}
            width={56}
            height={56}
            className="rounded-lg"
          />
        </div>
      </Link>
    ))}
  </div>
);
