import { VALORY_GIT_URL } from 'common-util/constants';
import { formatEthNumber } from 'common-util/numberFormatter';
import SectionHeading from 'components/SectionHeading';
import { Card } from 'components/ui/card';
import { Popover } from 'components/ui/popover';
import { StaleIndicator, StaleMetricContent } from 'components/ui/StaleIndicator';
import { ExternalLink, Link } from 'components/ui/typography';
import { cn } from 'lib/utils';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { isFrozen } from 'common-util/graphql/metric-utils';
import { MetricStatus } from 'common-util/graphql/types';

import { useMilestoneConfetti } from './useMilestoneConfetti';

const imgPath = '/images/homepage/activity/';

const agents = ['predict', 'babydegen', 'mech', 'agentsfun'];

// Keyframes name from globals.css — used to find the ring animation at runtime.
const MILESTONE_SPIN = 'milestone-ring-spin';
const MILESTONE_HOVER_SPEED = 2.1;

// Format a USD metric, falling back to '--' when the value is missing/non-numeric
// (e.g. a snapshot taken before this metric existed) so we never render "$NaN".
const formatUsd = (value?: string | number, fractionDigits?: number) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return '--';
  return `$${num.toLocaleString(
    'en-US',
    fractionDigits != null
      ? { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits }
      : undefined
  )}`;
};

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
  ataTransactionsStatus?: MetricStatus;
  mechFeesStatus?: MetricStatus;
  feesCollectedStatus?: MetricStatus;
};

type TransactionsCardProps = {
  transactions?: string;
  transactionsStatus?: MetricStatus;
  isMilestone?: boolean;
};

type ActivityMetrics = {
  transactions?: { value?: number; status?: MetricStatus };
  olasStaked?: { value?: number; status?: MetricStatus };
  dailyActiveAgents?: { value?: number; status?: MetricStatus };
  mechFees?: { value?: number | string; status?: MetricStatus };
  feesCollected?: { value?: number | string; status?: MetricStatus };
  ataTransactions?: { value?: number; status?: MetricStatus };
  totalOperators?: { value?: number; status?: MetricStatus };
};

type ActivityProps = {
  metrics?: ActivityMetrics | null;
  isTxnMilestone?: boolean;
};

const ActivityValue = ({
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
          // A frozen metric stays grey even during the milestone run — the
          // celebration must not paint over a value that stopped updating.
          isFrozen(status) ? 'text-gray-400' : (valueClassName ?? 'text-purple-700')
        )}
      >
        {value}
      </div>
    </LinkComponent>
    {text}
  </div>
);

const OlasIsBurnedArrow = ({ pointsDown = false, className = '' }: OlasIsBurnedArrowProps) => (
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

const ActivityCard = ({
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

const UsersCard = ({
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

const OlasBurnedCard = () => (
  <ActivityCard
    icon="olas-burned.png"
    alt="OLAS burned"
    primary={{
      value: '$0',
      text: 'OLAS burned',
      link: '/data#protocol-fees',
      isLinkExternal: false,
    }}
  />
);

const DailyActiveAgentsCard = ({
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
          <Popover>
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

const AgentToAgentCard = ({
  ataTransactions,
  mechFees,
  feesCollected,
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
        </>
      ),
      link: '/data#protocol-fees',
      status: feesCollectedStatus,
      isLinkExternal: false,
    }}
  />
);

const TransactionsCard = ({
  transactions,
  transactionsStatus,
  isMilestone = false,
}: TransactionsCardProps) => {
  const { containerRef, canvasRef, fire } = useMilestoneConfetti(isMilestone);
  const popRef = useRef<Animation | null>(null);

  useEffect(() => () => popRef.current?.cancel(), []);

  // Driven here rather than by toggling a CSS class: a class can't restart
  // mid-flight, so spamming clicks left the previous run to finish before the
  // next began, which is what made it stutter. Cancelling and replaying the
  // animation restarts cleanly however fast it's clicked.
  const pop = useCallback(() => {
    const card = containerRef.current?.querySelector('.milestone-card');
    if (!card || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    popRef.current?.cancel();
    popRef.current = card.animate([{ scale: 1 }, { scale: 1.03 }, { scale: 1 }], {
      duration: 260,
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    });
  }, [containerRef]);

  // Speed the ring up via playbackRate rather than a CSS duration swap: the
  // swap keeps the animation's absolute time, which resolves to a different
  // angle at the new duration and makes the ring jump. playbackRate leaves the
  // current position alone, so one ring simply picks up pace.
  const setRingSpeed = useCallback(
    (rate: number) => {
      containerRef.current
        ?.getAnimations?.({ subtree: true })
        .filter((animation) => (animation as CSSAnimation).animationName === MILESTONE_SPIN)
        .forEach((animation) => {
          animation.updatePlaybackRate(rate);
        });
    },
    [containerRef]
  );

  const handleCardClick = useCallback(
    (event: React.MouseEvent) => {
      // The value is a link to /data — let that click navigate instead of
      // celebrating. Everything else on the card fires the confetti.
      if ((event.target as HTMLElement).closest('a')) return;

      fire();
      pop();
    },
    [fire, pop]
  );

  const card = (
    <ActivityCard
      icon={isMilestone ? 'txns-milestone.png' : 'txns.png'}
      alt="Transactions"
      iconWidth={isMilestone ? 48 : 40}
      iconHeight={isMilestone ? 48 : 40}
      cardClassName={isMilestone ? 'milestone-card relative' : undefined}
      text={isMilestone ? <span className="milestone-caption">20M milestone</span> : undefined}
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
        valueClassName: isMilestone ? 'milestone-value' : undefined,
      }}
    />
  );

  if (!isMilestone) return card;

  return (
    // Plain `relative` on purpose: opacity / filter / transform / will-change
    // here would make this a backdrop root and cut the canvas out of the card's
    // backdrop.
    // Click-to-celebrate is a pointer-only easter egg layered on top of the
    // automatic scroll volley — deliberately not a button, since making the
    // card interactive would nest the value's /data link inside a control.
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <div
      ref={containerRef}
      onClick={handleCardClick}
      onMouseEnter={() => setRingSpeed(MILESTONE_HOVER_SPEED)}
      onMouseLeave={() => setRingSpeed(1)}
      className="relative w-full md:w-[300px]"
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        // Far wider than the card — canvas-confetti only draws inside its own
        // canvas, so a tight box would clip the particles at the edge.
        // Width/height are explicit: <canvas> is a replaced element with an
        // intrinsic 300x150 size, so left+right alone would not stretch it.
        className="milestone-confetti pointer-events-none absolute -left-[170px] -top-[190px] w-[calc(100%+340px)] h-[calc(100%+300px)]"
      />
      {card}
      {/* Sits above the card so the rim covers its border. Two layers because
          the gradient rotates while the mask that shapes it must not. */}
      <div className="milestone-ring" aria-hidden>
        <div className="milestone-ring-spin" />
      </div>
    </div>
  );
};

const AgentsGrid = () => (
  <div className="flex flex-row w-[124px] flex-wrap mb-2 px-auto">
    {agents.map((item) => (
      <Link key={item} href={`/agent-economies/${item}`}>
        <Image
          src={`/images/homepage/activity/${item}.png`}
          alt={item}
          width={62}
          height={62}
          className="hover:-translate-y-1 duration-150"
        />
      </Link>
    ))}
  </div>
);

export const Activity = ({ metrics = null, isTxnMilestone = false }: ActivityProps) => {
  // Preview escape hatch: `?milestone=1` shows the celebration before the
  // counter actually crosses. Applied after mount, so hydration is unaffected.
  const [isMilestonePreview, setIsMilestonePreview] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('milestone') === '1') {
      setIsMilestonePreview(true);
    }
  }, []);

  const showMilestone = isTxnMilestone || isMilestonePreview;

  const processedMetrics = useMemo(() => {
    if (!metrics) {
      return {
        transactions: '--',
        transactionsStatus: undefined,
        olasStaked: '--',
        olasStakedStatus: undefined,
        dailyActiveAgents: '--',
        dailyActiveAgentsStatus: undefined,
        mechFees: '--',
        mechFeesStatus: undefined,
        feesCollected: '--',
        feesCollectedStatus: undefined,
        ataTransactions: '--',
        ataTransactionsStatus: undefined,
        totalOperators: '--',
        totalOperatorsStatus: undefined,
      };
    }

    return {
      transactions: metrics.transactions?.value?.toLocaleString() || '--',
      transactionsStatus: metrics.transactions?.status,
      olasStaked: metrics.olasStaked?.value?.toLocaleString() || '--',
      olasStakedStatus: metrics.olasStaked?.status,
      dailyActiveAgents: metrics.dailyActiveAgents?.value?.toLocaleString() || '--',
      dailyActiveAgentsStatus: metrics.dailyActiveAgents?.status,
      mechFees: metrics.mechFees?.value || '--',
      mechFeesStatus: metrics.mechFees?.status,
      feesCollected: metrics.feesCollected?.value ?? '--',
      feesCollectedStatus: metrics.feesCollected?.status,
      ataTransactions: metrics.ataTransactions?.value?.toLocaleString() || '--',
      ataTransactionsStatus: metrics.ataTransactions?.status,
      totalOperators: metrics.totalOperators?.value?.toLocaleString() || '--',
      totalOperatorsStatus: metrics.totalOperators?.status,
    };
  }, [metrics]);

  // Preview-only stand-in. Local builds frequently come up without a blob
  // snapshot, leaving the card reading "--" so the celebration can't be judged.
  // Unreachable in production: it needs both ?milestone=1 and a missing value.
  const transactionsValue =
    isMilestonePreview && processedMetrics.transactions === '--'
      ? '20,012,345'
      : processedMetrics.transactions;

  return (
    <div className="max-w-4xl mx-auto">
      <SectionHeading
        color="text-gray-900"
        weight="font-bold"
        other="mb-12 max-w-3xl text-center mx-auto max-lg:mx-4"
      >
        OLAS: Powers AI Agent Economies
      </SectionHeading>
      <p className="text-lg text-slate-600 mb-20 max-lg:mx-4">
        The OLAS token is powering a flywheel driving larger and larger agent economies: Each Pearl
        user stakes OLAS to access their agents&apos; benefits. To provide utility to their users,
        Pearl agents use the marketplace. The marketplace charges fees to agents. Fees are used to
        burn OLAS.
      </p>

      <div className="flex flex-col max-w-4xl mx-auto text-slate-500 place-items-center hidden md:flex">
        <div className="flex flex-row">
          <p className="w-[124px] text-sm pt-24">Attracts more builders and users</p>
          <Image
            src={`${imgPath}arrow5.png`}
            alt="arrow"
            width={124}
            height={176}
            className="mt-12 ml-3 md:mr-4 w-[124px] h-[176px]"
          />
          <UsersCard
            olasStaked={processedMetrics.olasStaked}
            totalOperators={processedMetrics.totalOperators}
            totalOperatorsStatus={processedMetrics.totalOperatorsStatus}
            olasStakedStatus={processedMetrics.olasStakedStatus}
          />
          <Image
            src={`${imgPath}arrow.png`}
            alt="arrow"
            width={150}
            height={142}
            className="mt-14 mr-2 w-[150px] h-[142px]"
          />
          <p className="w-[124px] text-sm pt-24">Stake OLAS to use Pearl agents</p>
        </div>
        <div className="flex flex-row place-items-center w-full justify-between">
          <div className="flex flex-col">
            <OlasBurnedCard />
            <OlasIsBurnedArrow className="" />
          </div>
          <div className="flex flex-col place-items-center z-10">
            <AgentsGrid />
            <Link href="/agent-economies">Agent economies</Link>
          </div>
          <div className="flex flex-col">
            <DailyActiveAgentsCard
              dailyActiveAgents={processedMetrics.dailyActiveAgents}
              dailyActiveAgentsStatus={processedMetrics.dailyActiveAgentsStatus}
            />
            <div className="flex flex-row">
              <Image
                src={`${imgPath}arrow2.png`}
                alt="arrow2"
                width={28}
                height={124}
                className="h-[124px] ml-auto"
              />
              <p className="w-[82px] text-sm mr-[38px] ml-2 my-auto">Agents are active</p>
            </div>
          </div>
        </div>
        <div className="flex flex-row place-items-center">
          <AgentToAgentCard
            ataTransactions={processedMetrics.ataTransactions}
            mechFees={processedMetrics.mechFees}
            feesCollected={processedMetrics.feesCollected}
            ataTransactionsStatus={processedMetrics.ataTransactionsStatus}
            mechFeesStatus={processedMetrics.mechFeesStatus}
            feesCollectedStatus={processedMetrics.feesCollectedStatus}
          />
          <div>
            <Image
              src={`${imgPath}arrow3.png`}
              alt="arrow2"
              width={257}
              height={10}
              className="ml-4"
            />
            <p>AI Agent Bazaar is used</p>
          </div>
          <TransactionsCard
            transactions={transactionsValue}
            transactionsStatus={processedMetrics.transactionsStatus}
            isMilestone={showMilestone}
          />
        </div>
      </div>

      <div className="flex flex-col md:hidden w-[90%] mx-auto">
        <UsersCard
          olasStaked={processedMetrics.olasStaked}
          totalOperators={processedMetrics.totalOperators}
          totalOperatorsStatus={processedMetrics.totalOperatorsStatus}
          olasStakedStatus={processedMetrics.olasStakedStatus}
        />
        <Image
          src={`${imgPath}mobile-arrow.png`}
          alt="arrow"
          width={240}
          height={120}
          className="mx-auto mb-2"
        />
        <DailyActiveAgentsCard
          dailyActiveAgents={processedMetrics.dailyActiveAgents}
          dailyActiveAgentsStatus={processedMetrics.dailyActiveAgentsStatus}
        />
        <Image
          src={`${imgPath}mobile-arrow2.png`}
          alt="arrow"
          width={132}
          height={120}
          className="mx-auto mb-2"
        />
        <TransactionsCard
          transactions={transactionsValue}
          transactionsStatus={processedMetrics.transactionsStatus}
          isMilestone={showMilestone}
        />
        <Image
          src={`${imgPath}mobile-arrow3.png`}
          alt="arrow"
          width={180}
          height={120}
          className="mx-auto mb-2"
        />
        <AgentToAgentCard
          ataTransactions={processedMetrics.ataTransactions}
          mechFees={processedMetrics.mechFees}
          ataTransactionsStatus={processedMetrics.ataTransactionsStatus}
          mechFeesStatus={processedMetrics.mechFeesStatus}
        />
        <OlasIsBurnedArrow pointsDown className="mx-auto mb-2" />
        <OlasBurnedCard />
        <Image
          src={`${imgPath}mobile-arrow5.png`}
          alt="arrow"
          width={343}
          height={202}
          className="mx-auto mb-12"
        />
        <div className="mx-auto grid place-items-center z-10">
          <AgentsGrid />
          <div>
            As a result, <Link href="/agent-economies">Agent economies</Link> are thriving.
          </div>
        </div>
      </div>
    </div>
  );
};
